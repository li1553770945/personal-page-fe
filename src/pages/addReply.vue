<template>
    <div class="message-form">
        <el-form ref="formRef" :model="replyForm" :rules="replyRules" label-width="120px">
            <el-form-item label="消息ID" prop="message_id">
                <el-input v-model="replyForm.message_id" ></el-input>
            </el-form-item>
            <el-form-item label="回复内容" prop="content">
                <el-input type="textarea" v-model="replyForm.content" :autosize="{ minRows: 4, maxRows: 8 }"
                   ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.prevent="submitForm">提交</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, unref } from 'vue';
import { addReplyAPI } from "@/request/api";
import { ElNotification } from 'element-plus';

const replyForm = reactive({
    message_id:0,
    content:"",
})
// 表单验证规则
const replyRules = reactive({
    message_id: [{ required: true, message: '请输入文章ID', trigger: 'blur' }],
    content: [{ required: true, message: '请输入回复内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '回复内容在10-1000个字', trigger: 'blur' }],
});
const formRef = ref();
const submitForm = async () => {
    const form = unref(formRef);
    if (!form) return
    await form.validate((valid: any) => {
        if (valid) {
            replyForm.message_id = Number(replyForm.message_id);
            addReplyAPI(replyForm).then(
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
    // 提交留言

};






</script>


