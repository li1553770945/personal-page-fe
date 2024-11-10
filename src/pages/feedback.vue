<template>
    <el-tabs v-model="tab.activeName.value" class="demo-tabs" @tab-click="tab.handleClick">
        <el-tab-pane label="提建议" name="message"></el-tab-pane>
        <el-tab-pane label="回复查询" name="reply"></el-tab-pane>
    </el-tabs>
    <div class="message" v-if="tab.activeName.value == 'message'">
        <el-form ref="feedbackFormRef" :model="feedback.feedbackForm" :rules="feedback.feedbackFormRules" label-width="120px">
            <el-form-item label="问题类别" prop="categoryId">
                <el-select v-model="feedback.feedbackForm.categoryId" placeholder="请选择问题类别">
                    <el-option v-for="category in feedback.categories" :label="category.name"
                        :value="category.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="feedback.feedbackForm.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="留言内容" prop="content">
                <el-input type="textarea" v-model="feedback.feedbackForm.content" :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入留言内容（切换页面时该内容会保存，但是刷新后被清空）"></el-input>
            </el-form-item>
            <el-form-item label="署名" prop="name">
                <el-input v-model="feedback.feedbackForm.name" placeholder="请输入署名"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="feedback.feedbackForm.contact" placeholder="请输入联系方式（请注明是QQ，还是微信、手机号等）非必填"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.prevent="feedback.submitForm">提交</el-button>
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
        <el-form ref="replyQueryFormRef" :inline="true" :model="reply.replyQueryForm" :rules="reply.replyQueryRules" >
            <el-row>
                <el-col :span="20">
                    <el-form-item label="留言ID" style="width: 95%;"  prop="uuid">
                        <el-input v-model="reply.replyQueryForm.uuid" placeholder="请输入留言ID" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" @click="reply.Query()">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>


    <el-dialog v-model="feedback.dialogVisible.value" title="提示">
        <span>留言ID：{{ feedback.submitFeedbackID }} <br>请记录此ID，该ID是唯一获取回复的方式。该对话框关闭后ID将无法再次查询。请勿泄露，任何拥有此ID的人都可以看到建议及回复</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="feedback.dialogVisible.value = false">
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
import { useFeedback } from "../store/feedback"
import { allFeedbackCategoriesAPI, saveFeedbackAPI} from "@/request/api";
import { ElNotification, TabsPaneContext } from 'element-plus';
import router from '@/routes';
const feedbackFormRef = ref();
const replyQueryFormRef = ref();
class Tab {
    activeName = ref("message");
    handleClick = (tab: TabsPaneContext, event: Event) => {

    }
}

class Reply{
    replyQueryForm = reactive({
        uuid: ''
    })
    replyQueryRules = reactive({
        uuid: [{ required: true, message: '请输入留言ID', trigger: 'blur' }]
    })
    NavigateToReply = () =>{
        router.push(`/read-msg/${this.replyQueryForm.uuid}`)
    }
    Query = () => {
        const form = unref(replyQueryFormRef);
        if (!form) return
        form.validate((valid: any) => {
            if (valid) {
                this.NavigateToReply();
            } else {
                console.log('error submit!')
            }
        })
    }
}

const reply = new Reply();

class Feedback {
    feedbackForm = reactive({
        categoryId: '',
        content: '',
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
    feedbackFormRules = reactive({
        categoryId: [{ required: true, message: '请选择类别', trigger: 'blur' },
        { validator: this.validateCategoryId, trigger: 'blur' }],
        content: [{ required: true, message: '请输入留言内容', trigger: 'blur' },
        { min: 10, max: 1000, message: '留言内容在10-1000个字', trigger: 'blur' }],
        name: [{ required: true, message: '请输入署名', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    });

    dialogVisible = ref(false);
    submitFeedbackID = ref("");
    categories = reactive<{ name: string; value: string, id: number }[]>([]);

    getCategories = () => {
        allFeedbackCategoriesAPI().then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '获取留言类别失败',
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
                    title: '获取留言类别请求失败',
                    message: err.message,
                    type: 'error',
                })
            }
        )
    }
    storeFeedback = () => {
        const feedbackStore = useFeedback();
        const { category,content, contact, name } = storeToRefs(feedbackStore);
        category.value = this.feedbackForm.categoryId;
        content.value = this.feedbackForm.content;
        contact.value = this.feedbackForm.contact;
        name.value = this.feedbackForm.name;
    }
    loadFeedback = () => {
        const feedbackStore = useFeedback();
        const { category, content, contact, name } = storeToRefs(feedbackStore);
        this.feedbackForm.categoryId = category.value;
        this.feedbackForm.content = content.value;
        this.feedbackForm.contact = contact.value;
        this.feedbackForm.name = name.value;
    }
    // 表单验证规则
    submitForm = async () => {
        const form = unref(feedbackFormRef);
        if (!form) return
        await form.validate((valid: any) => {
            if (valid) {
                saveFeedbackAPI(this.feedbackForm).then(
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
                            this.feedbackForm.content = "";
                            this.feedbackForm.contact = "";
                            this.feedbackForm.name = "";
                            this.submitFeedbackID.value = data.uuid;
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
        

    };
}





const feedback = new Feedback();
const tab = new Tab();


onMounted(() => {
    feedback.loadFeedback();
    feedback.getCategories();
})

onBeforeRouteLeave(() => {
    feedback.storeFeedback();
})

</script>


<style scoped>


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


