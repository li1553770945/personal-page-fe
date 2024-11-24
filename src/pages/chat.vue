<template>
    
    <!-- 聊天容器 -->
    <div class="chat-container">
      <!-- 创建或加入房间的控件 -->
      <HeaderRoomControls />
      <!-- 显示消息的组件 -->
      <MessageDisplay />
      <!-- 发送新消息的输入框 -->
      <MessageInput />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed, onMounted } from 'vue';
  import HeaderRoomControls from '../components/chat/headerRoomControls.vue';
  import MessageDisplay from '../components/chat/messageDisplay.vue';
  import MessageInput from '../components/chat/messageInput.vue';
  
  
  // 在组件挂载时执行初始化操作
  onMounted(() => {
    // 如需要，这里进行初始化操作
  });
  </script>
  