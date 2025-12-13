<template>
    <div class="input-box">
      <div class="input-toolbar">
        <el-upload
          ref="fileUploadRef"
          :auto-upload="false"
          :on-change="handleFileChange"
          :show-file-list="false"
          :limit="1"
        >
          <template #trigger>
            <el-button type="primary" :icon="Document" size="small">选择文件</el-button>
          </template>
        </el-upload>
        <span v-if="selectedFile" class="file-info">
          {{ selectedFile.name }}
          <el-button 
            type="danger" 
            :icon="Close" 
            size="small" 
            text 
            @click="clearFile"
            style="margin-left: 8px;"
          ></el-button>
        </span>
      </div>
      <el-input 
        v-model="inputMessage" 
        type="textarea" 
        :rows="6"
        placeholder="请输入消息内容，按下回车键发送消息（Shift+Enter换行）" 
        @keydown.enter.exact.prevent="handleSendMessage"
        @keydown.shift.enter.exact="handleNewLine"
      ></el-input>
      <div class="input-actions">
        <el-button 
          type="primary" 
          @click="handleSendMessage"
          :loading="uploading"
          :disabled="!inputMessage.trim() && !selectedFile"
        >
          发送消息
        </el-button>
        <el-button 
          v-if="selectedFile"
          type="success" 
          @click="handleSendFile"
          :loading="uploading"
        >
          发送文件
        </el-button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useConnectStore } from '../../store/connectStore';
  import { ElNotification } from 'element-plus';
  import { Document, Close } from '@element-plus/icons-vue';
  import { uploadFileAPI } from '../../request/api';
  import axios from 'axios';
  
  const { sendMessage, sendFileMessage } = useConnectStore();
  const inputMessage = ref('');
  const selectedFile = ref<File | null>(null);
  const fileUploadRef = ref();
  const uploading = ref(false);
  
  function handleFileChange(file: { raw: File }) {
    selectedFile.value = file.raw;
  }
  
  function clearFile() {
    selectedFile.value = null;
    fileUploadRef.value?.clearFiles();
  }
  
  function handleNewLine() {
    // Shift+Enter 换行，不做任何处理，让默认行为生效
  }
  
  async function handleSendFile() {
    if (!selectedFile.value) {
      ElNotification({
        title: '发送失败',
        message: '请先选择文件',
        type: 'error'
      });
      return;
    }
    
    uploading.value = true;
    const fileName = selectedFile.value.name;
    
    try {
      // 1. 获取上传URL
      const res = await uploadFileAPI({
        name: fileName,
        key: '', // 留空自动生成
        maxDownload: 0, // 0表示永不消失，可以根据需要调整
      });
      
      const data = res.data;
      if (data.code !== 0) {
        throw new Error(data.message || '获取上传URL失败');
      }
      
      const { signedUrl, key } = data.data;
      
      // 2. 上传文件
      await axios.put(signedUrl, selectedFile.value, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Accept': '*/*',
          'Connection': 'keep-alive',
        },
      });
      
      // 3. 发送文件消息
      const result = sendFileMessage({
        key,
        name: fileName,
        size: selectedFile.value.size,
      });
      
      if (result) {
        ElNotification({
          title: '发送成功',
          message: `文件 ${fileName} 已发送`,
          type: 'success'
        });
        clearFile();
      }
    } catch (error: any) {
      ElNotification({
        title: '发送失败',
        message: error.message || '文件上传失败',
        type: 'error'
      });
    } finally {
      uploading.value = false;
    }
  }
  
  function handleSendMessage() {
    if (inputMessage.value.trim() !== '') {
      const result = sendMessage(inputMessage.value);
      if (result) {
        inputMessage.value = '';
      } 
    } else if (selectedFile.value) {
      // 如果没有文字但有文件，发送文件
      handleSendFile();
    } else {
      ElNotification({
        title: '发送失败',
        message: '消息不能为空',
        type: 'error'
      });
    }
  }
  </script>
  
  <style scoped>
  .input-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .input-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
  }
  
  .file-info {
    font-size: 12px;
    color: var(--el-text-color-regular);
    display: flex;
    align-items: center;
  }
  
  .input-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  </style>
  