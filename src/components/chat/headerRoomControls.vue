<template>
  <div class="header-room-controls">
    <!-- 状态栏显示连接状态 -->
    <div class="status-bar" :class="'status-bar-' + connectionStatus">
      {{ statusText }}
    </div>
    <div class="information-header" v-if=" connectionStatus == 'connected' ">
            当前聊天ID:{{ curRoomId }}
            <br>
            当前客户端ID:{{ clientId }}
        </div>
    <el-row class="operator-header" v-if=" connectionStatus != 'connected' ">
      <el-col :span="4">
        <el-button @click="CreateAndConnect()" type="primary" :disabled="connectionStatus=='connecting'" :loading="creating">创建聊天室</el-button>
      </el-col>
      <el-col :span="8">
        <el-input v-model="inputRoomId" placeholder="请输入房间ID"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="JoinAndConnect()" :disabled="connectionStatus=='connecting'"  :loading="joining">加入聊天室</el-button>
      </el-col>
      <el-col :span="4"  v-if="lastRoomId">
        <el-button @click="ReJoinAndConnect()" :disabled="connectionStatus=='connecting'"  :loading="rejoining">重新加入聊天{{ lastRoomId }}</el-button>
      </el-col>
    </el-row>
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
.status-bar {
    /* 设置顶部文字的样式 */
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    margin-bottom: 10px;
}

.status-bar-connected {
    /* 设置连接成功状态的背景色和文字颜色 */
    background-color: green;
    color: white;
}

.status-bar-not-connected,
.status-bar-connect-fail,
.status-bar-connect-interupt {
    /* 设置连接失败状态的背景色和文字颜色 */
    background-color: red;
    color: white;
}
</style>