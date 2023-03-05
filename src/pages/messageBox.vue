<template>
    <div class="message-form">
        <el-form ref="formRef" :model="messageForm" :rules="messageFormRules" label-width="120px">
            <el-form-item label="问题类别" prop="category">
                <el-select v-model="messageForm.category_id" placeholder="请选择问题类别">
                    <el-option v-for="category in categories" :label="category.name" :value="category.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="留言内容" prop="message">
                <el-input type="textarea" v-model="messageForm.message" :autosize="{ minRows: 4, maxRows: 8 }"
                    placeholder="请输入留言内容（切换页面时该内容会保存，但是刷新后被清空）"></el-input>
            </el-form-item>
            <el-form-item label="署名" prop="name">
                <el-input v-model="messageForm.name" placeholder="请输入署名"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="messageForm.contact" placeholder="请输入联系方式（请注明是QQ，还是微信、手机号等）非必填"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.prevent="submitForm">提交</el-button>
            </el-form-item>
            <el-form-item>
                <router-link to="/appreciate">
                    <h3>如果感觉有帮助，您可以点击这句话赞赏我。</h3>
                </router-link>
            </el-form-item>
        </el-form>

    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, reactive,unref, onMounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import {useMessage} from "../store/message"
import {allMessageCategoriesAPI,saveMessageAPI} from "@/request/api";
import { ElNotification } from 'element-plus';
const messageStore = useMessage();
const {category,message,contact,name} = storeToRefs(messageStore);
const messageForm = reactive({
    category_id: 0,
    message: '',
    contact: '',
    name:'',
})
const  categories =reactive<{ name: string; value: string,id:number }[]>([]);


// 表单验证规则
const messageFormRules = reactive({
    category_id: [{ required: true, message: '请选择类别', trigger: 'blur' }],
    message: [{ required: true, message: '请输入留言内容', trigger: 'blur' },
    { min: 10, max: 1000, message: '留言内容在10-1000个字', trigger: 'blur' }],
    name:[{ required: true, message: '请输入署名', trigger: 'blur' }]
});
const formRef = ref();
const submitForm =async () => {
    const form = unref(formRef);
    console.log(form)
    if (!form) return
    await form.validate((valid: any) => {
        if (valid) {
            saveMessageAPI(messageForm).then(
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
                            title: '留言成功',
                            message: "已收到您的宝贵建议，感谢反馈",
                            type: 'success',
                        })
                        messageForm.message = "";
                        messageForm.contact = "";
                        messageForm.name = "";
                        
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

onMounted(() => {
  messageForm.category_id = category.value;
  messageForm.message = message.value;
  messageForm.contact = contact.value;
  messageForm.name = name.value;

allMessageCategoriesAPI().then(
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
          title: '获取消息类别成功',
          type: 'success',
        })
        categories.splice(0, categories.length, ...data);
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
})

onBeforeRouteLeave(() => {
    category.value = messageForm.category_id;
    message.value = messageForm.message;
    contact.value = messageForm.contact;
    name.value = messageForm.name;
})

</script>


