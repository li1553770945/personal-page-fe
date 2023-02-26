<template>
    <div class="register-form">
        <el-form ref="formRef" :model="registerForm" :rules="registerFormRules" label-width="120px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="registerForm.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="nickname">
                <el-input v-model="registerForm.nickname"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerForm.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="registerForm.confirmPassword"></el-input>
            </el-form-item>
            <el-form-item label="激活码" prop="activate_code">
                <el-input v-model="registerForm.activate_code"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
  
<script lang="ts" setup>
import { ElNotification } from 'element-plus';
import { reactive, ref, unref } from 'vue';
import { registerAPI } from '../request/api'
import { useRouter } from 'vue-router'
// 表单数据
const registerForm = reactive({
    username: '',
    password: '',
    nickname: '',
    confirmPassword: '',
    activate_code: '',
});
const router = useRouter()

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
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 20, message: '用户名长度在5-20个字之间', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2-10个字符之间', trigger: 'blur' }],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' },
    ],
    activate_code: [
        { required: true, message: '请输入激活码', trigger: 'blur' },
    ]
});


const formRef = ref()

const handleSubmit = async () => {
    const form = unref(formRef)
    if (!form) return
    await form.validate((valid: any) => {
        if (valid) {
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
                        data = data.data
                        ElNotification({
                            title: '注册成功',
                            message: "请您登陆",
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
            )
        } else {
            console.log('error submit!')
        }
    })
    // 位置2
}


</script>

<style scoped>
.register-form {
    max-width: 400px;
    margin: 50px auto;
}
</style>