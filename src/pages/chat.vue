<template>
    
    <!-- 聊天容器 -->
    <div class="chat-container">
      <!-- 创建或加入房间的控件 -->
      <HeaderRoomControls  />
      <!-- 显示消息的组件 -->
      <MessageDisplay class="message-display-component" />
      <!-- 发送新消息的输入框 -->
      <MessageInput class="message-input-component"/>
    </div>
  </template>
  
  <script lang="ts" setup>
  import HeaderRoomControls from '../components/chat/headerRoomControls.vue';
  import MessageDisplay from '../components/chat/messageDisplay.vue';
  import MessageInput from '../components/chat/messageInput.vue';
  
  
 
  </script>
 <style scoped>
 .chat-container {
    height: 100vh;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

 .message-input-component {
    margin-top: 1rem;
  }

  .message-display-component{
    margin-top: 1rem;
    margin-bottom: 1rem;
    flex: 1;
    overflow-y: auto;
  }
  
</style> 