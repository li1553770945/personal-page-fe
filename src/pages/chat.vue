<template>
    
    <!-- 聊天容器 -->
    <div class="chat-container">
      <!-- 创建或加入房间的控件 -->
      <div class="header-section">
        <HeaderRoomControls  />
        <!-- 分享按钮 -->
        <el-button 
          v-if="curRoomId && connectionStatus === 'connected'"
          type="success" 
          :icon="Share"
          @click="copyShareLink"
          class="share-button"
        >
          分享聊天室
        </el-button>
      </div>
      <!-- 显示消息的组件 -->
      <MessageDisplay class="message-display-component" />
      <!-- 发送新消息的输入框 -->
      <MessageInput class="message-input-component"/>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, watch, ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { Share } from '@element-plus/icons-vue';
  import { ElNotification } from 'element-plus';
  import HeaderRoomControls from '../components/chat/headerRoomControls.vue';
  import MessageDisplay from '../components/chat/messageDisplay.vue';
  import MessageInput from '../components/chat/messageInput.vue';
  import { useRoomStore } from '@/store/roomStore';
  import { useConnectStore } from '@/store/connectStore';
  import { storeToRefs } from 'pinia';
  
  const route = useRoute();
  const roomStore = useRoomStore();
  const { joinRoom } = roomStore;
  const { curRoomId } = storeToRefs(roomStore);
  
  const connectStore = useConnectStore();
  const { connect } = connectStore;
  const { connectionStatus, joining } = storeToRefs(connectStore);
  
  // 防止重复执行的标志
  const isAutoJoining = ref(false);
  
  // 自动加入聊天室的函数
  const autoJoinChat = async (chatId: string) => {
    // 如果已经连接到相同的房间，不需要重新加入
    if (connectionStatus.value === 'connected' && curRoomId.value === chatId) {
      return;
    }
    
    // 如果正在自动加入中，防止重复执行
    if (isAutoJoining.value) {
      return;
    }
    
    // 如果正在连接中，也不处理
    if (connectionStatus.value === 'connecting') {
      return;
    }
    
    try {
      isAutoJoining.value = true;
      connectionStatus.value = 'connecting';
      joining.value = true;
      const result = await joinRoom(chatId);
      if (result) {
        connect(chatId);
      } else {
        joining.value = false;
        connectionStatus.value = 'connect-fail';
      }
    } catch (error) {
      console.error('自动加入聊天室失败:', error);
      joining.value = false;
      connectionStatus.value = 'connect-fail';
    } finally {
      isAutoJoining.value = false;
    }
  };
  
  // 监听路由参数变化
  watch(
    () => route.query.chatId,
    (chatId) => {
      if (chatId && typeof chatId === 'string') {
        autoJoinChat(chatId);
      }
    },
    { immediate: false }
  );
  
  // 生成分享链接
  const shareLink = computed(() => {
    const chatId = curRoomId.value || (route.query.chatId as string);
    if (!chatId) {
      return '';
    }
    return `${window.location.origin}/chat?chatId=${chatId}`;
  });
  
  // 复制分享链接到剪贴板
  const copyShareLink = async () => {
    if (!shareLink.value) {
      ElNotification({
        title: '复制失败',
        message: '当前没有可分享的聊天室',
        type: 'warning',
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(shareLink.value);
      ElNotification({
        title: '复制成功',
        message: '分享链接已复制到剪贴板',
        type: 'success',
      });
    } catch (err) {
      // 降级方案：使用旧的复制方法
      const textArea = document.createElement('textarea');
      textArea.value = shareLink.value;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        ElNotification({
          title: '复制成功',
          message: '分享链接已复制到剪贴板',
          type: 'success',
        });
      } catch (fallbackErr) {
        ElNotification({
          title: '复制失败',
          message: '请手动复制链接',
          type: 'error',
        });
      }
      document.body.removeChild(textArea);
    }
  };
  
  // 组件挂载时检查路由参数
  onMounted(() => {
    const chatId = route.query.chatId;
    if (chatId && typeof chatId === 'string') {
      autoJoinChat(chatId);
    }
  });
 
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

  .header-section {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 1rem;
  }

  .share-button {
    flex-shrink: 0;
    margin-top: 0;
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

  @media (max-width: 768px) {
    .header-section {
      flex-direction: column;
    }
    
    .share-button {
      width: 100%;
    }
  }
  
</style> 