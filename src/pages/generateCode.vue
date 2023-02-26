<template>
    <el-form :model="generateForm" label-width="120px">
        <el-form-item label="用户名">
            <el-input v-model="generateForm.username" />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
        <el-form-item v-if="submitUsername !=''">
            {{submitUsername }}的激活码是{{ activateCode }}
        </el-form-item>
    </el-form>
    
</template>
  
<script lang="ts" setup>
import { reactive } from 'vue'
import { generateCodeAPI } from "../request/api"
import { ElNotification } from 'element-plus'
import {ref} from 'vue'
const submitUsername = ref("")
const activateCode = ref("") 

const generateForm= reactive({
    username: "",
})

const onSubmit = () => {
    console.log('submit!');
    generateCodeAPI(generateForm).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '生成失败',
                    message: data.msg,
                    type: 'error',
                })
            } else {
                data = data.data
                ElNotification({
                    title: '生成成功',
                    message: "激活码"+data.activate_code,
                    type: 'success',
                })
                submitUsername.value = generateForm.username;
                activateCode.value = data.activate_code;
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
  