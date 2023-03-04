<template>
    <div>
        <form>
            <el-form-item label="问题类别">
                <el-select v-model="category" placeholder="请选择问题类别">
                    <el-option label="产品问题" value="product"></el-option>
                    <el-option label="支付问题" value="payment"></el-option>
                    <el-option label="配送问题" value="shipping"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="留言内容">
                <el-input type="textarea" v-model="message" :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入留言内容"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
                <el-input v-model="contact" placeholder="请输入联系方式（请注明QQ、微信、手机号等）"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.prevent="submitForm">提交</el-button>
            </el-form-item>
        </form>
       
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


const category = ref('');
const message = ref('');
const contact = ref('');

const submitForm = () => {
    // 提交留言
    console.log({
        category: category.value,
        message: message.value,
        contact: contact.value,
    });
    // 清空表单
    category.value = '';
    message.value = '';
    contact.value = '';
};


</script>



