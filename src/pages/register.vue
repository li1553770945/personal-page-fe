<template>
    <div class="register-container">
        <div class="register-card">
            <h2 class="register-title">注册新账号</h2>
            <el-form ref="formRef" :model="registerForm" :rules="registerFormRules" label-width="0" size="large">
                <el-form-item prop="username">
                    <el-input 
                        v-model="registerForm.username" 
                        placeholder="请输入用户名（5-20个字符）"
                        :prefix-icon="User"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="nickname">
                    <el-input 
                        v-model="registerForm.nickname" 
                        placeholder="请输入昵称（2-10个字符）"
                        :prefix-icon="Avatar"
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input 
                        type="password" 
                        v-model="registerForm.password" 
                        placeholder="请输入密码（6-20个字符）"
                        :prefix-icon="Lock"
                        show-password
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="confirmPassword">
                    <el-input 
                        type="password" 
                        v-model="registerForm.confirmPassword" 
                        placeholder="请确认密码"
                        :prefix-icon="Lock"
                        show-password
                        clearable
                    />
                </el-form-item>
                <el-form-item prop="activate_code">
                    <el-input 
                        v-model="registerForm.activate_code" 
                        placeholder="请输入激活码"
                        :prefix-icon="Key"
                        clearable
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit" :loading="isLoading" class="register-button">
                        注册
                    </el-button>
                </el-form-item>
                <div class="register-footer">
                    <router-link to="/login" class="login-link">已有账号？立即登录</router-link>
                </div>
            </el-form>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { ElNotification } from 'element-plus';
import { reactive, ref } from 'vue';
import { registerAPI } from '../request/api'
import { useRouter } from 'vue-router'
import { User, Lock, Avatar, Key } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const isLoading = ref(false)

// 表单数据
const registerForm = reactive({
    username: '',
    password: '',
    nickname: '',
    confirmPassword: '',
    activate_code: '',
});

// 自定义密码确认验证规则
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
    if (value === '') {
        callback(new Error('请再次输入密码'));
    } else if (value !== registerForm.password) {
        callback(new Error('两次输入的密码不一致'));
    } else {
        callback();
    }
};

// 表单验证规则
const registerFormRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 20, message: '用户名长度在5-20个字符之间', trigger: 'blur' }
    ],
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 10, message: '昵称长度在2-10个字符之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' },
    ],
    activate_code: [
        { required: true, message: '请输入激活码', trigger: 'blur' },
    ]
});

const handleSubmit = async () => {
    if (!formRef.value) return
    
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return
    
    isLoading.value = true
    registerAPI(registerForm).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '注册失败',
                    message: data.msg,
                    type: 'error',
                })
            } else {
                ElNotification({
                    title: '注册成功',
                    message: "请您登录",
                    type: 'success',
                })
                router.push("/login")
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
    ).finally(() => {
        isLoading.value = false
    })
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.register-card {
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--el-border-color-light);
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.register-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
}

.login-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: var(--el-color-primary-dark-2);
  text-decoration: underline;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  --el-input-height: 44px;
}

[data-theme="dark"] .register-card {
  background: var(--el-bg-color-page);
  border-color: var(--el-border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>