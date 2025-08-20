<template>
    <div class="read-msg-page">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-wrapper">
            <el-skeleton :rows="6" animated class="skeleton-card" />
            <el-skeleton :rows="4" animated class="skeleton-card small" />
        </div>

        <!-- 未找到 -->
        <el-empty v-else-if="!isFind" description="未找到该留言" />

        <!-- 找到数据展示 -->
        <div v-else>
            <el-card class="message-card" shadow="hover">
                <template #header>
                    <div class="header-main">
                        <h2 class="title">{{ feedback.feedbackData.title }}</h2>
                        <div class="meta-line">
                            <el-space wrap size="large">
                                <span class="meta-item">
                                    <el-icon><UserFilled /></el-icon>
                                    <span>{{ feedback.feedbackData.name || '匿名' }}</span>
                                </span>
                                <span class="meta-item">
                                    <el-icon><PhoneFilled /></el-icon>
                                    <span>{{ feedback.feedbackData.contact || '无' }}</span>
                                </span>
                                <span class="meta-item">
                                    <el-icon><List /></el-icon>
                                    <el-tag size="small" type="info">{{ feedback.feedbackData.category || '未分类' }}</el-tag>
                                </span>
                                <span class="meta-item time">提交于 {{ formatDateTimeUnixSecond(feedback.feedbackData.createdAt) }}</span>
                            </el-space>
                        </div>
                    </div>
                </template>
                <div class="message-content">{{ feedback.feedbackData.content }}</div>
            </el-card>

            <!-- 已回复 -->
            <el-card v-if="isReplid" class="reply-card" shadow="never">
                <template #header>
                    <div class="reply-header">
                        <el-icon class="reply-icon"><List /></el-icon>
                        <h3>回复</h3>
                    </div>
                </template>
                <div class="reply-content">{{ feedback.replyData.content }}</div>
                <template #footer>
                    <span class="footer-time">回复于 {{ formatDateTimeUnixSecond(feedback.replyData.createdAt) }}</span>
                </template>
            </el-card>

            <!-- 未回复 (普通用户) -->
            <el-card v-if="!isReplid && role != 'admin'" class="not-reply-card" shadow="never">
                <el-empty description="留言暂未回复" />
            </el-card>

            <!-- 管理员回复表单 -->
            <el-card v-if="!isReplid && role == 'admin'" class="reply-form-card" shadow="never">
                <template #header>
                    <div class="reply-header">
                        <h3>添加回复</h3>
                    </div>
                </template>
                <el-form ref="formRef" :model="reply.replyForm" :rules="reply.replyRules" label-position="top" class="reply-form">
                    <el-form-item prop="content" label="回复内容">
                        <el-input
                            type="textarea"
                            v-model="reply.replyForm.content"
                            :autosize="{ minRows: 5, maxRows: 10 }"
                            maxlength="1000"
                            show-word-limit
                            placeholder="请输入回复内容 (10-1000 字)"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="reply.addReply(feedback.feedbackData.id)">提交</el-button>
                        <el-button @click="reply.replyForm.content = ''" type="default">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
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
const isFind = ref(false); // 是否找到有效数据
const isLoading = ref(true); // 初始加载状态
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
                    isLoading.value = false;
                } else {
                    isFind.value = true;
                    console.log(data.data.name)
                    this.feedbackData = data.data;
                    this.getReply();
                    isLoading.value = false;
                }
            }
        ).catch(
            err => {
                ElNotification({
                    title: '获取消息类别请求失败',
                    message: err.message,
                    type: 'error',
                })
                isLoading.value = false;
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
/* 页面整体容器 */
.read-msg-page {
    max-width: 880px;
    margin: 32px auto 60px;
    padding: 0 16px;
    box-sizing: border-box;
}

/* 加载骨架布局 */
.loading-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.skeleton-card {
    padding: 18px 22px;
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
}
.skeleton-card.small { max-width: 620px; }

/* 卡片间距 */
.message-card,
.reply-card,
.not-reply-card,
.reply-form-card { margin-bottom: 22px; }

.header-main { display: flex; flex-direction: column; gap: 6px; }
.title { margin: 0; font-size: 20px; font-weight: 600; }
.meta-line { font-size: 13px; color: var(--el-text-color-secondary); }
.meta-item { display: inline-flex; align-items: center; gap: 4px; }
.meta-item.time { opacity: 0.85; }

.message-content, .reply-content { line-height: 1.75; font-size: 15px; white-space: pre-wrap; }

.reply-header { display: flex; align-items: center; gap: 6px; }
.reply-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
.reply-icon { color: var(--el-color-primary); }
.footer-time { font-size: 12px; color: var(--el-text-color-secondary); }

.reply-form :deep(.el-form-item) { margin-bottom: 18px; }
.reply-form :deep(textarea) { font-family: inherit; }

@media (max-width: 600px) {
    .read-msg-page { margin-top: 20px; }
    .title { font-size: 18px; }
    .meta-line { display: flex; flex-direction: column; gap: 4px; }
    .meta-item.time { margin-top: 2px; }
}
</style>