<template>
    <el-card class="message-card">
        <template #header>
            <div class="message-title">
                <h2> {{ msg.messageData.title }}</h2>
            </div>
            <div class="author-contact-container">
                <div class="author">
                    <el-icon>
                        <UserFilled />
                    </el-icon> {{ msg.messageData.name }}
                </div>
                <div class="contact">
                    <el-icon>
                        <PhoneFilled />
                    </el-icon> {{ msg.messageData.contact }}
                </div>
                <div class="category">
                    <el-icon>
                        <List />
                    </el-icon> {{ msg.messageData.category.name }}
                </div>
            </div>
        </template>
        <div class="message-content">{{ msg.messageData.message }}</div>
        <template #footer>
            发表于{{ formatDate(msg.messageData.created_at) }}
        </template>
    </el-card>

    <el-card class="reply-card" v-if="isReplid">
        <template #header>
            <div class="message-title">
                <h2>回复</h2>
            </div>
        </template>
        <div class="message-content">{{ msg.replyData.content }}</div>
        <template #footer>
            回复于{{ formatDate(msg.replyData.created_at) }}
        </template>
    </el-card>
    <el-card class="not-reply-card" v-if="!isReplid && role != 'admin'">
        <template #header>
            <div class="message-title">
                <h2>文章暂未回复</h2>
            </div>
        </template>
        <el-empty description="文章暂未回复" />
    </el-card>

    <el-form ref="formRef" :model="reply.replyForm" :rules="reply.replyRules" v-if="!isReplid && role == 'admin'"
        label-position="top">
        <el-form-item prop="content">
            <el-input type="textarea" v-model="reply.replyForm.content" :autosize="{ minRows: 4, maxRows: 8 }"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="reply.addReply(formRef, msg.messageData.id)">提交</el-button>
        </el-form-item>
    </el-form>
</template>
  
<script setup lang="ts">
import { UserFilled, PhoneFilled, List } from "@element-plus/icons-vue";
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMessageAPI, getReplyAPI, addReplyAPI } from '@/request/api';
import { ElNotification } from 'element-plus'
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import { formatDate } from "@/utils/dataUtils";
import type { FormInstance } from 'element-plus'


const userStore = useUser()
const { isLogined, username, nickname, role } = storeToRefs(userStore)
const route = useRoute();
const uuid = ref(route.params.uuid as string);
const isReplid = ref(false);

const formRef = ref<FormInstance>()

class Message {
    messageData = reactive({
        id: "",
        title: "",
        name: "",
        contact: "",
        message: "",
        created_at: "",
        category: {
            "name": "",
        }
    })
    replyData = reactive({
        id: "",
        content: "",
        created_at: "",
    })
    getMessage = () => {

        getMessageAPI(uuid.value).then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '获取文章失败',
                        message: data.msg,
                        type: 'error',
                    })
                } else {
                    this.messageData.id = data.data.id;
                    this.messageData.name = data.data.name;
                    this.messageData.title = data.data.title;
                    this.messageData.contact = data.data.contact;
                    this.messageData.message = data.data.message;
                    this.messageData.created_at = data.data.created_at;
                    this.messageData.category = data.data.category;
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
                        message: data.msg,
                        type: 'error',
                    })
                } else {
                    this.replyData.id = data.data.id;
                    this.replyData.content = data.data.content
                    this.replyData.created_at = data.data.created_at;
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
        message_id: "",
        content: "",
    })
    replyRules = reactive({
        content: [{ required: true, message: '请输入回复内容', trigger: 'blur' },
        { min: 10, max: 1000, message: '回复内容在10-1000个字', trigger: 'blur' }],
    });
    addReply = (replyForm: FormInstance | undefined, id: string) => {
        if (!replyForm) {
            return;
        }
        replyForm.validate((valid) => {
            if (valid) {
                this.replyForm.message_id = id;
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
                            msg.getReply();
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


const msg = new Message();
const reply = new Reply();
onMounted(() => {
    msg.getMessage();
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
  