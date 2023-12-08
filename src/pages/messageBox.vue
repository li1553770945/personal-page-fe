<template>
    <el-tabs v-model="tab.activeName.value" class="demo-tabs" @tab-click="tab.handleClick">
        <el-tab-pane label="提建议" name="message"></el-tab-pane>
        <el-tab-pane label="建议查询" name="query-message"></el-tab-pane>
        <el-tab-pane label="回复查询" name="reply"></el-tab-pane>
    </el-tabs>
    <div class="message" v-if="tab.activeName.value == 'message'">
        <el-form ref="messageFormRef" :model="message.messageForm" :rules="message.messageFormRules" label-width="120px">
            <el-form-item label="问题类别" prop="category_id">
                <el-select v-model="message.messageForm.category_id" placeholder="请选择问题类别">
                    <el-option v-for="category in message.categories" :label="category.name"
                        :value="category.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="message.messageForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="留言内容" prop="message">
                <el-input type="textarea" v-model="message.messageForm.message" :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入留言内容（切换页面时该内容会保存，但是刷新后被清空）"></el-input>
            </el-form-item>
            <el-form-item label="署名" prop="name">
                <el-input v-model="message.messageForm.name" placeholder="请输入署名"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="message.messageForm.contact" placeholder="请输入联系方式（请注明是QQ，还是微信、手机号等）非必填"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.prevent="message.submitForm">提交</el-button>
            </el-form-item>
            <el-form-item>
                <router-link to="/appreciate">
                    <h3>如果感觉有帮助，您可以点击这句话赞赏我。</h3>
                </router-link>
            </el-form-item>
        </el-form>
    </div>

    <div class="reply" v-if="tab.activeName.value == 'reply'">

        <br>
        <el-form :inline="true">
            <el-row>
                <el-col :span="20">
                    <el-form-item label="UUID" style="width: 95%;">
                        <el-input v-model="reply.replyUUID.value" placeholder="请输入UUID" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" @click="reply.getReply">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="reply" v-if="reply.replyContent">
            <h2>回复内容</h2>
            <p>{{ reply.replyContent.value }}</p>
        </div>
    </div>

    <div class="article-container" v-if="tab.activeName.value == 'query-message'">
        <el-form :inline="true">
            <el-row>
                <el-col :span="20">
                    <el-form-item label="UUID" style="width: 95%;">
                        <el-input v-model="getMessage.getMessageUUID.value" placeholder="请输入UUID" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" @click="getMessage.getMessage()">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="article-header">
            <div class="article-info">
                <span>署名：{{ getMessage.message.name }}</span> <br>
                <span>联系方式：{{ getMessage.message.contact }}</span>
            </div>
        </div>
        <div class="article-content">
            <div v-html="getMessage.message.content"></div>
        </div>
    </div>
    <el-dialog v-model="message.dialogVisible.value" title="提示">
        <span>消息ID：{{ message.submitMessageID }} <br>请记录此ID，该ID是唯一获取回复的方式。该对话框关闭后ID将无法再次查询。</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="message.dialogVisible.value = false">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, reactive, unref, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useMessage } from "../store/message"
import { allMessageCategoriesAPI, saveMessageAPI, getReplyAPI, getMessageAPI } from "@/request/api";
import { ElNotification, TabsPaneContext } from 'element-plus';
const messageFormRef = ref();

class Tab {
    activeName = ref("message");
    handleClick = (tab: TabsPaneContext, event: Event) => {

    }
}

class Message {
    messageForm = reactive({
        category_id: '',
        message: '',
        contact: '',
        name: '',
        title: '',
    })
    validateCategoryId = (rule: any, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请选择类别'));
        } else {
            callback();
        }
    };
    messageFormRules = reactive({
        category_id: [{ required: true, message: '请选择类别', trigger: 'blur' },
        { validator: this.validateCategoryId, trigger: 'blur' }],
        message: [{ required: true, message: '请输入留言内容', trigger: 'blur' },
        { min: 10, max: 1000, message: '留言内容在10-1000个字', trigger: 'blur' }],
        name: [{ required: true, message: '请输入署名', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    });

    dialogVisible = ref(false);
    submitMessageID = ref("");
    categories = reactive<{ name: string; value: string, id: number }[]>([]);

    getCategories = () => {
        allMessageCategoriesAPI().then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '获取消息类别失败',
                        message: data.msg,
                        type: 'error',
                    })
                } else {
                    data = data.data
                    this.categories.splice(0, this.categories.length, ...data);
                }
            }
        ).catch(
            err => {
                ElNotification({
                    title: '获取消息类别请求失败',
                    message: err.message,
                    type: 'error',
                })
            }
        )
    }
    storeMessage = () => {
        const messageStore = useMessage();
        const { category, message, contact, name } = storeToRefs(messageStore);
        category.value = this.messageForm.category_id;
        message.value = this.messageForm.message;
        contact.value = this.messageForm.contact;
        name.value = this.messageForm.name;
    }
    loadMessage = () => {
        const messageStore = useMessage();
        const { category, message, contact, name } = storeToRefs(messageStore);
        this.messageForm.category_id = category.value;
        this.messageForm.message = message.value;
        this.messageForm.contact = contact.value;
        this.messageForm.name = name.value;
    }
    // 表单验证规则
    submitForm = async () => {
        const form = unref(messageFormRef);
        if (!form) return
        await form.validate((valid: any) => {
            if (valid) {
                saveMessageAPI(this.messageForm).then(
                    (res) => {
                        let data = res.data;
                        if (data.code != 0) {
                            ElNotification({
                                title: '操作失败',
                                message: data.msg,
                                type: 'error',
                            })
                        } else {
                            data = data.data
                            ElNotification({
                                title: '留言成功',
                                message: "已收到您的宝贵建议，感谢反馈",
                                type: 'success',
                            })
                            this.messageForm.message = "";
                            this.messageForm.contact = "";
                            this.messageForm.name = "";
                            this.submitMessageID.value = data.uuid;
                            this.dialogVisible.value = true;

                        }
                    }
                ).catch(
                    err => {
                        ElNotification({
                            title: '请求失败',
                            message: err.message,
                            type: 'error',
                        })
                    }
                )
            } else {
                console.log('error submit!')
            }
        })
        // 提交留言

    };
}




class Reply {
    replyUUID = ref("");
    replyContent = ref("");
    
    validateCategoryId = (rule: any, value: string, callback: any) => {
        if (value === '') {
            callback(new Error('请选择类别'));
        } else {
            callback();
        }
    };
    getReply = async () => {
        getReplyAPI(this.replyUUID.value).then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '操作失败',
                        message: data.msg,
                        type: 'error',
                    })
                } else {
                    ElNotification({
                        title: '查询成功',
                        message: "该消息已被回复",
                        type: 'success',
                    })
                    this.replyContent.value = data.data.content;
                }
            }
        ).catch(
            err => {
                ElNotification({
                    title: '请求失败',
                    message: err.message,
                    type: 'error',
                })
            }
        )
    };
}

class GetMessage {
    getMessageUUID = ref("");
    message = reactive({
        content: "",
        name: "",
        contact: "",
    });
    getMessage = async () => {
        getMessageAPI(this.getMessageUUID.value).then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '操作失败',
                        message: data.msg,
                        type: 'error',
                    })
                } else {
                    ElNotification({
                        title: '查询成功',
                        type: 'success',
                    })
                    data = data.data;
                    this.message.content = data.message;
                    this.message.name = data.name;
                    this.message.contact = data.contact;
                    console.log(this.message)
                }
            }
        ).catch(
            err => {
                ElNotification({
                    title: '请求失败',
                    message: err.message,
                    type: 'error',
                })
            }
        )
    };
}

const message = new Message();
const reply = new Reply();
const getMessage = new GetMessage();
const tab = new Tab();


onMounted(() => {
    message.loadMessage();
    message.getCategories();
})

onBeforeRouteLeave(() => {
    message.storeMessage();
})

</script>


<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
    width: 100%;
}

.reply {
    text-align: center;
}

.reply h2 {
    font-size: 20px;
}

.reply p {
    font-size: 16px;
}

.article-header {
    border-bottom: 1px solid #eee;
    padding: 16px 0;
  }
  
  .article-author {
    font-weight: bold;
    font-size: 16px;
  }
  
  .article-contact {
    color: #999;
    font-size: 14px;
  }
  
  .article-content {
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.8;
  }
</style>


我正在使用vue3的组合式API和element-plus实现一个查询未读消息列表页面，现在已经实现了一个函数用于获取未读消息列表数据，你可以使用import { unreadMessageAPI } from "@/request/api";来使用，他会返回一个列表，内容样例为：[{name:"张三",message:"测试"},{name:"李四",message:"测试"}]。现在，请你帮我完成整个前端页面。