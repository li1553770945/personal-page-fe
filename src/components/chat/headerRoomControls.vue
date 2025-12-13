<template>
  <div class="header-room-controls">
    <!-- 状态栏显示连接状态 -->
    <div class="status-bar" :class="'status-bar-' + connectionStatus">
      <span class="status-text">{{ statusText }}</span>
    </div>
    
    <!-- 连接成功时的信息展示 -->
    <div class="information-card" v-if="connectionStatus == 'connected'">
      <div class="info-content">
        <div class="info-item">
          <span class="info-label">聊天ID:</span>
          <span class="info-value">{{ curRoomId }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">客户端ID:</span>
          <span class="info-value">{{ clientId }}</span>
        </div>
      </div>
      <slot name="actions"></slot>
    </div>
    
    <!-- 未连接时的操作区域 -->
    <div class="operator-card" v-if="connectionStatus != 'connected'">
      <div class="operator-row">
        <el-button 
          @click="CreateAndConnect()" 
          type="primary" 
          :disabled="connectionStatus=='connecting'" 
          :loading="creating"
          size="default"
        >
          创建聊天室
        </el-button>
        <div class="join-section">
          <el-input 
            v-model="inputRoomId" 
            placeholder="请输入房间ID"
            size="default"
            @keyup.enter="JoinAndConnect"
          ></el-input>
          <el-button 
            @click="JoinAndConnect()" 
            :disabled="connectionStatus=='connecting' || !inputRoomId.trim()"  
            :loading="joining"
            size="default"
          >
            加入
          </el-button>
        </div>
        <el-button 
          v-if="lastRoomId"
          @click="ReJoinAndConnect()" 
          :disabled="connectionStatus=='connecting'"  
          :loading="rejoining"
          size="default"
        >
          重新加入
        </el-button>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" title="连接失败" width="30%">
    <span>与服务器连接失败，请刷新页面并重新创建对话</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" type="primary">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

import { storeToRefs } from 'pinia'
import { useRoomStore } from '@/store/roomStore';
import { useConnectStore } from '@/store/connectStore';
import { onMounted } from 'vue';

const roomStore = useRoomStore();
const { createRoom, joinRoom, reJoinRoom } = roomStore;
const { inputRoomId, lastRoomId,curRoomId,clientId } = storeToRefs(roomStore);

const connectStore = useConnectStore();
const { connect } = connectStore;
const { connectionStatus, dialogVisible, statusText,joining,creating,rejoining } = storeToRefs(connectStore);

const CreateAndConnect = () => {
  connectionStatus.value = 'connecting';
  creating.value = true;
  createRoom().then((result: boolean) => {
    if (result) { 
      connect(curRoomId.value);
     }
    else{
      creating.value = false;
      connectionStatus.value = "connect-fail"
    }
  })
}
const JoinAndConnect = () => {
  connectionStatus.value = 'connecting';
  joining.value = true;
  joinRoom(inputRoomId.value).then((result: boolean) => {
    if (result) { connect(inputRoomId.value); } else{
      joining.value = false;
      connectionStatus.value = "connect-fail"
    }
  })
}
const ReJoinAndConnect = () => {
  connectionStatus.value = 'connecting';
  rejoining.value = true;
  reJoinRoom();
  connect(curRoomId.value);
}

onMounted(() => {
  console.log(connectionStatus.value)
})
</script>

<style scoped>
.header-room-controls {
  width: 100%;
}

.status-bar {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 15px;
  margin-bottom: 12px;
  border-radius: 6px;
  font-weight: 500;
}

.status-text {
  display: inline-block;
}

.status-bar-connected {
  background-color: #67c23a;
  color: white;
}

.status-bar-not-connected,
.status-bar-connect-fail,
.status-bar-connect-interupt {
  background-color: #f56c6c;
  color: white;
}

.status-bar-connecting {
  background-color: #409eff;
  color: white;
}

.information-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.info-content {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  flex: 1;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: var(--el-text-color-primary);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: var(--el-fill-color-light);
  padding: 4px 8px;
  border-radius: 4px;
}

.operator-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 12px;
}

.operator-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.join-section {
  display: flex;
  gap: 8px;
  flex: 1;
  min-width: 300px;
}

.join-section .el-input {
  flex: 1;
}

@media (max-width: 768px) {
  .information-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-content {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }
  
  .operator-row {
    flex-direction: column;
  }
  
  .join-section {
    width: 100%;
    min-width: auto;
  }
}
</style>