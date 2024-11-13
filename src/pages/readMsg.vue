<template>
    <h1 v-if="!isFind">未找到该留言</h1>
    <div v-if="isFind"> <el-card class="message-card">
            <template #header>
                <div class="message-title">
                    <h2> {{ feedback.feedbackData.title }}</h2>
                </div>
                <div class="author-contact-container">
                    <div class="author">
                        <el-icon>
                            <UserFilled />
                        </el-icon> {{ feedback.feedbackData.name }}
                    </div>
                    <div class="contact">
                        <el-icon>
                            <PhoneFilled />
                        </el-icon> {{ feedback.feedbackData.contact }}
                    </div>
                    <div class="category">
                        <el-icon>
                            <List />
                        </el-icon> {{ feedback.feedbackData.category}}
                    </div>
                </div>
            </template>
            <div class="message-content">{{ feedback.feedbackData.content }}</div>
            <template #footer>
                发表于{{ formatDateTimeUnixSecond(feedback.feedbackData.createdAt) }}
            </template>
        </el-card>

        <el-card class="reply-card" v-if="isReplid">
            <template #header>
                <div class="message-title">
                    <h2>回复</h2>
                </div>
            </template>
            <div class="message-content">{{ feedback.replyData.content }}</div>
            <template #footer>
                回复于{{ formatDateTimeUnixSecond(feedback.replyData.createdAt) }}
            </template>
        </el-card>
        <el-card class="not-reply-card" v-if="!isReplid && role != 'admin'">
            <template #header>
                <div class="message-title">
                    <h2>留言暂未回复</h2>
                </div>
            </template>
            <el-empty description="留言暂未回复" />
        </el-card>

        <el-form ref="formRef" :model="reply.replyForm" :rules="reply.replyRules" v-if="!isReplid && role == 'admin'"
            label-position="top">
            <el-form-item prop="content">
                <el-input type="textarea" v-model="reply.replyForm.content"
                    :autosize="{ minRows: 4, maxRows: 8 }"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="reply.addReply(feedback.feedbackData.id)">提交</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script setup lang="ts">
import { UserFilled, PhoneFilled, List } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, unref } from 'vue';
import { useRoute } from 'vue-router';
import { getFeedbackAPI, getReplyAPI, addReplyAPI } from '@/request/api';
import { ElNotification } from 'element-plus'
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import { formatDate, formatDateTimeUnixSecond } from "@/utils/dataUtils";


const userStore = useUser()
const { isLogined, username, nickname, role } = storeToRefs(userStore)
const route = useRoute();
const uuid = ref(route.params.uuid as string);
const isReplid = ref(false);
const isFind = ref(false);
const formRef = ref()

class Feedback {
    feedbackData = reactive({
        id: "",
        title: "",
        name: "",
        contact: "",
        content: "",
        createdAt: 0,
        category:  "",
        
    })
    replyData = reactive({
        content: "",
        createdAt: 0,
    })
    getFeedback = () => {

        getFeedbackAPI(uuid.value).then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '获取留言失败',
                        message: data.message,
                        type: 'error',
                    })
                } else {
                    isFind.value = true;
                    console.log(data.data.name)
                    this.feedbackData.id = data.data.id;
                    this.feedbackData.name = data.data.name;
                    this.feedbackData.title = data.data.title;
                    this.feedbackData.contact = data.data.contact;
                    this.feedbackData.content = data.data.content;
                    this.feedbackData.createdAt = data.data.createdAt;
                    this.feedbackData.category = data.data.category;
                    this.getReply();
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
    getReply = () => {
        getReplyAPI(uuid.value).then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '获取回复失败',
                        message: data.message,
                        type: 'error',
                    })
                } else {
                    this.replyData.content = data.data.content
                    this.replyData.createdAt = data.data.createdAt;
                    isReplid.value = true;
                }
            }
        ).catch(
            err => {
                ElNotification({
                    title: '获取回复请求失败',
                    message: err.message,
                    type: 'error',
                })
            }
        )
    }
}


class Reply {
    replyForm = reactive({
        feedbackId: "",
        content: "",
    })
    replyRules = reactive({
        content: [{ required: true, message: '请输入回复内容', trigger: 'blur' },
        { min: 10, max: 1000, message: '回复内容在10-1000个字', trigger: 'blur' }],
    });
    addReply = async (id:string) => {
        const replyForm = unref(formRef);
        if (!replyForm) {
            return;
        }
        replyForm.validate((valid:boolean) => {
            if (valid) {
                this.replyForm.feedbackId = id;
                addReplyAPI(this.replyForm).then(
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
                                title: '回复成功',
                                type: 'success',
                            })
                            feedback.getReply();
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
                return false
            }
        })

    }
}


const feedback = new Feedback();
const reply = new Reply();
onMounted(() => {
    feedback.getFeedback();
})
</script>

<style scoped>
.message-card,
.not-reply-card,
.reply-card {
    margin-bottom: 20px;
}

.message-title {
    text-align: center;
}

.author-contact-container {
    display: flex;
    justify-content: start;
    align-items: center;
}

.author,
.category,
.contact {
    margin-right: 20px;
    color: gray;
}

.message-content {
    word-wrap: break-word;
}
</style>