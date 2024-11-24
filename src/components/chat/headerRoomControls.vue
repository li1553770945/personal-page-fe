<template>
  <div class="header-room-controls">
    <!-- 状态栏显示连接状态 -->
    <div class="status-bar" :class="'status-bar-' + connectionStatus">
      {{ statusText }}
    </div>
    <el-row>
      <el-col :span="8">
        <el-button @click="CreateAndConnect()">创建聊天室</el-button>
      </el-col>
      <el-col :span="8">
        <el-input v-model="inputRoomId" placeholder="请输入房间ID"></el-input>
      </el-col>
      <el-col :span="8">
        <el-button @click="JoinAndConnect()">加入聊天室</el-button>
      </el-col>
      <el-col span="4" style="margin:1rem;" v-if="lastRoomId">
        <el-button @click="ReJoinAndConnect()">重新加入聊天{{ lastRoomId }}</el-button>
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
const { inputRoomId, lastRoomId } = storeToRefs(roomStore);

const connectStore = useConnectStore();
const { connect } = connectStore;
const { connectionStatus, dialogVisible, statusText } = storeToRefs(connectStore);

const CreateAndConnect = () => {
  createRoom().then((result: boolean) => {
    if (result) { connect(); }
  })
}
const JoinAndConnect = () => {
  joinRoom().then((result: boolean) => {
    if (result) { connect(); }
  })
}
const ReJoinAndConnect = () => {
  reJoinRoom();
  connect();
}

onMounted(() => {
  console.log(localStorage.getItem('roomId'))
})
</script>