<template>
    <div class="login-container">
        <div class="login-card">
            <h2 class="login-title">登录</h2>
            <el-form ref="formRef" :model="loginForm" :rules="loginRules" label-width="0" size="large">
                <el-form-item prop="username">
                    <el-input 
                        v-model="loginForm.username" 
                        placeholder="请输入用户名"
                        :prefix-icon="User"
                        clearable
                    />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input 
                        v-model="loginForm.password" 
                        type="password" 
                        placeholder="请输入密码"
                        :prefix-icon="Lock"
                        show-password
                        clearable
                        @keyup.enter="onSubmit"
                    />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="isLoading" class="login-button">
                        登录
                    </el-button>
                </el-form-item>
                
                <div class="login-footer">
                    <router-link to="/register" class="register-link">还没有账号？立即注册</router-link>
                </div>
            </el-form>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { loginAPI,userInfoAPI } from "../request/api"
import { ElNotification } from 'element-plus'
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import { useRouter} from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'

const userStore = useUser()
const router = useRouter();
const { token,isLogined, username, nickname,role } = storeToRefs(userStore)

const formRef = ref()
const isLoading = ref(false)

const loginForm = reactive({
    username: "",
    password: "",
})

const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
    ]
}

const onSubmit = async () => {
    if (!formRef.value) return
    
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    isLoading.value = true
    console.log('submit!');
    loginAPI(loginForm).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '登录失败',
                    message: data.message,
                    type: 'error',
                })
            } else {
                data = data.data
                token.value = data.token;
                localStorage.setItem("token", data.token);
                ElNotification({
                    title: '登录成功',
                    type: 'success',
                })
                router.back();
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--el-border-color-light);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
}

.register-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.register-link:hover {
  color: var(--el-color-primary-dark-2);
  text-decoration: underline;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-input {
  --el-input-height: 44px;
}

[data-theme="dark"] .login-card {
  background: var(--el-bg-color-page);
  border-color: var(--el-border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>
