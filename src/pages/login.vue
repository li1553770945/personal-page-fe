<template>
    <el-form :model="loginForm" label-width="120px">
        <el-form-item label="用户名">
            <el-input v-model="loginForm.username" />
        </el-form-item>

        <el-form-item label="密码">
            <el-input v-model="loginForm.password" type="password" show-password />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
    </el-form>
</template>
  
<script lang="ts" setup>
import { reactive } from 'vue'
import { loginAPI,userInfoAPI } from "../request/api"
import { ElNotification } from 'element-plus'
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import { useRouter} from 'vue-router'

const userStore = useUser()
const router = useRouter();
const { token,isLogined, username, nickname,role } = storeToRefs(userStore)


const loginForm = reactive({
    username: "",
    password: "",
})

const onSubmit = () => {
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
    )
}
</script>
  