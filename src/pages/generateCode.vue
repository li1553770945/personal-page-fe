<template>
    <div class="page-container">
        <el-card class="gen-card" shadow="hover">
            <template #header>
                <div class="card-header">
                    <h2>生成激活码</h2>
                    <el-tag type="info" size="small">后台管理</el-tag>
                </div>
            </template>
            <el-form ref="formRef" :model="generateForm" :rules="rules" label-position="top" class="gen-form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model.trim="generateForm.username" placeholder="请输入要生成激活码的用户名" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="submitting">生成</el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
            <transition name="fade">
                <div v-if="submitUsername" class="result-area">
                    <el-alert type="success" :closable="false" show-icon>
                        <template #title>
                            <span class="result-text">用户 <strong>{{ submitUsername }}</strong> 的激活码：</span>
                            <el-tag size="large" type="success" class="code-tag">{{ activateCode }}</el-tag>
                            <el-button size="small" text type="primary" @click="copyCode" :icon="CopyIcon">复制</el-button>
                        </template>
                    </el-alert>
                </div>
            </transition>
        </el-card>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref, unref } from 'vue'
import { generateCodeAPI } from "../request/api"
import { ElNotification } from 'element-plus'
import { DocumentCopy as CopyIcon } from '@element-plus/icons-vue'

const formRef = ref()
const submitUsername = ref("")
const activateCode = ref("")
const submitting = ref(false)

const generateForm = reactive({
    username: "",
})

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 30, message: '长度 3-30 个字符', trigger: 'blur' }
    ]
})

const onSubmit = () => {
    const form = unref(formRef)
    if (!form) return
    form.validate((valid: boolean) => {
        if (!valid) return
        submitting.value = true
        generateCodeAPI(generateForm).then(
            (res) => {
                let data = res.data
                if (data.code != 0) {
                    ElNotification({
                        title: '生成失败',
                        message: data.msg,
                        type: 'error'
                    })
                } else {
                    data = data.data
                        ElNotification({
                            title: '生成成功',
                            message: '激活码 ' + data.activate_code,
                            type: 'success'
                        })
                        submitUsername.value = generateForm.username
                        activateCode.value = data.activate_code
                }
            }
        ).catch(err => {
            ElNotification({
                title: '请求失败',
                message: err.message,
                type: 'error'
            })
        }).finally(() => submitting.value = false)
    })
}

const reset = () => {
    generateForm.username = ''
    submitUsername.value = ''
    activateCode.value = ''
}

const copyCode = async () => {
    if (!activateCode.value) return
    try {
        await navigator.clipboard.writeText(activateCode.value)
        ElNotification({ title: '已复制', type: 'success' })
    } catch (e) {
        ElNotification({ title: '复制失败', message: (e as Error).message, type: 'error' })
    }
}
</script>

<style scoped>
.page-container { max-width: 640px; margin: 32px auto 56px; padding: 0 16px; }
.card-header { display: flex; align-items: center; gap: 12px; }
.card-header h2 { margin: 0; font-size: 20px; font-weight: 600; }
.gen-form :deep(.el-form-item) { margin-bottom: 18px; }
.result-area { margin-top: 8px; }
.code-tag { margin: 0 8px; font-size: 14px; }
.result-text strong { font-weight: 600; }
.fade-enter-active, .fade-leave-active { transition: opacity .25s, transform .25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(4px); }
@media (max-width: 520px) {
    .page-container { margin-top: 20px; }
    .card-header h2 { font-size: 18px; }
}
</style>
  