<template>
    <div class="input-box">
      <el-input v-model="inputMessage" type="textarea" placeholder="请输入消息内容" @keydown.enter.prevent="sendMessage"></el-input>
      <el-button @click="sendMessage">发送</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useConnectStore } from '../../store/connectStore';
  
  const { sendMessage } = useConnectStore();
  const inputMessage = ref('');
  
  function handleSendMessage() {
    if (inputMessage.value.trim() !== '') {
      sendMessage(inputMessage.value);
      inputMessage.value = '';
    }
  }
  </script>
  