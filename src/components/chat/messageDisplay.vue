<template>
    <el-scrollbar class="message-box" height="50vh">
      <div>
        <div v-for="msg in messages" :key="msg.id" class="message">
          <el-card :class="{ 'sent-by-self': msg.sendBySelf }">
            <div>{{ msg.sendBySelf ? '您' : '对方' }}: {{ msg.content }}</div>
          </el-card>
        </div>
      </div>
    </el-scrollbar>
  </template>
  
  <script setup>
  import { useMessageStore } from '../../store/messageStore';
  
  const { messages } = useMessageStore();
  </script>
  