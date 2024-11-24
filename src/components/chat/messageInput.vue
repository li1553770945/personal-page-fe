<template>
    <div class="input-box">
      <el-input v-model="inputMessage" 
      type="textarea" 
      :rows="6"
      placeholder="请输入消息内容，按下回车键发送消息" 
      @keydown.enter.prevent="handleSendMessage"></el-input>
      <!-- <el-button @click="handleSendMessage">发送</el-button> -->
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useConnectStore } from '../../store/connectStore';
import { ElNotification } from 'element-plus';
  
  const { sendMessage } = useConnectStore();
  const inputMessage = ref('');
  
  function handleSendMessage() {
    if (inputMessage.value.trim() !== '') {
      const result = sendMessage(inputMessage.value);
      if (result) {
        inputMessage.value = '';
      } 
    } else {
      ElNotification({
        title: '发送失败',
        message: '消息不能为空',
        type: 'error'
      });
    }
  }
  </script>
  