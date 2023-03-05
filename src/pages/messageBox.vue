<template>
    <div class="message-form">
        <el-card class="message-card">
            <el-form ref="formRef" :model="messageForm" :rules="messageFormRules" label-width="120px">
                <el-form-item label="问题类别" prop="category_id">
                    <el-select v-model="messageForm.category_id" placeholder="请选择问题类别">
                        <el-option v-for="category in categories" :label="category.name" :value="category.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="留言内容" prop="message">
                    <el-input type="textarea" v-model="messageForm.message" :autosize="{ minRows: 4, maxRows: 8 }"
                        placeholder="请输入留言内容（切换页面时该内容会保存，但是刷新后被清空）"></el-input>
                </el-form-item>
                <el-form-item label="署名" prop="name">
                    <el-input v-model="messageForm.name" placeholder="请输入署名"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="messageForm.contact" placeholder="请输入联系方式（请注明是QQ，还是微信、手机号等）非必填"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click.prevent="submitForm">提交</el-button>
                </el-form-item>
                <el-form-item>
                    <router-link to="/appreciate">
                        <h3>如果感觉有帮助，您可以点击这句话赞赏我。</h3>
                    </router-link>
                </el-form-item>
            </el-form>
        </el-card>
        <el-divider />

        <!-- <el-card id="reply">
            <template #header>
                <div class="card-header" style="text-align:center">
                    <h3>回复查询</h3>
                </div>
            </template>
            <el-input v-model="uuid" placeholder="请输入文章uuid"></el-input>
            <el-button type="primary" @click.prevent="getReply">查询</el-button>
            {{ reply }}
        </el-card> -->
        <div class="container">
            <el-card class="card">
                <div class="card-header" style="text-align:center">
                    <h3>回复查询</h3>
                    <span>目前暂不支持再次回复，但您可以再次提问并注明原消息uuid</span><br>
                </div>
                <br>
                <el-form :inline="true">
                    <el-row>
                        <el-col :span="20">
                            <el-form-item label="UUID" style="width: 95%;">
                                <el-input v-model="uuid" placeholder="请输入UUID" style="width: 100%;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item>
                                <el-button type="primary" @click="getReply">查询</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="reply" v-if="reply">
                    <h2>回复内容</h2>
                    <p>{{ reply }}</p>
                </div>
            </el-card>
        </div>
    </div>

    <el-dialog v-model="dialogVisible" title="Tips" width="30%">
        <span>消息ID：{{ messageID }} <br>请记录此ID，该ID是唯一获取回复的方式。该对话框关闭后ID将无法再次查询。</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">
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
import { allMessageCategoriesAPI, saveMessageAPI, getReplyAPI } from "@/request/api";
import { ElNotification } from 'element-plus';
const messageStore = useMessage();
const { category, message, contact, name } = storeToRefs(messageStore);
const messageForm = reactive({
    category_id: '',
    message: '',
    contact: '',
    name: '',
})
const categories = reactive<{ name: string; value: string, id: number }[]>([]);
const uuid = ref("");
const reply = ref("");
const dialogVisible = ref(false);
const messageID = ref("");
const validateCategoryId = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请选择类别'));
    } else {
        callback();
    }
};
// 表单验证规则
const messageFormRules = reactive({
    category_id: [{ required: true, message: '请选择类别', trigger: 'blur' },
    { validator: validateCategoryId, trigger: 'blur' }],
    message: [{ required: true, message: '请输入留言内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '留言内容在10-1000个字', trigger: 'blur' }],
    name: [{ required: true, message: '请输入署名', trigger: 'blur' }]
});
const formRef = ref();
const submitForm = async () => {
    const form = unref(formRef);
    if (!form) return
    await form.validate((valid: any) => {
        if (valid) {
            saveMessageAPI(messageForm).then(
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
                        messageForm.message = "";
                        messageForm.contact = "";
                        messageForm.name = "";
                        messageID.value = data.uuid;
                        dialogVisible.value = true;

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



const getReply = async () => {
    getReplyAPI(uuid.value).then(
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
                reply.value = data.data.content;
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


onMounted(() => {
    messageForm.category_id = category.value;
    messageForm.message = message.value;
    messageForm.contact = contact.value;
    messageForm.name = name.value;
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

                categories.splice(0, categories.length, ...data);
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
})

onBeforeRouteLeave(() => {
    category.value = messageForm.category_id;
    message.value = messageForm.message;
    contact.value = messageForm.contact;
    name.value = messageForm.name;
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
</style>


