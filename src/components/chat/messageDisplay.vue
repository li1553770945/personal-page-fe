<template>
  <el-scrollbar ref="scrollbarRef" class="message-box" height="50vh">
    <div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.sendBySelf ? 'sent-by-self' : 'received']"
      >
        <!-- 文本消息 -->
        <div v-if="!msg.type || msg.type === 'text'" class="text">{{ msg.content }}</div>
        <!-- 文件消息 -->
        <div v-else-if="msg.type === 'file' && msg.fileInfo" class="file-message">
          <div class="file-icon">
            <el-icon :size="24"><Document /></el-icon>
          </div>
          <div class="file-content">
            <div class="file-name">{{ msg.fileInfo.name }}</div>
            <div v-if="msg.fileInfo.size" class="file-size">{{ formatFileSize(msg.fileInfo.size) }}</div>
            <el-button 
              type="primary" 
              size="small" 
              :loading="downloading[msg.fileInfo.key]"
              @click="handleDownloadFile(msg.fileInfo.key, msg.fileInfo.name)"
              style="margin-top: 8px;"
            >
              {{ downloading[msg.fileInfo.key] ? '下载中...' : '下载文件' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useMessageStore } from "../../store/messageStore";
import { nextTick, ref, reactive } from "vue";
import { Document } from '@element-plus/icons-vue';
import { downloadFileAPI } from '../../request/api';
import { ElNotification, ElScrollbar } from 'element-plus';

const { messages } = useMessageStore();
const scrollbarRef = ref<InstanceType<typeof ElScrollbar> | null>(null);
const downloading = reactive<Record<string, boolean>>({});

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// 下载文件
const handleDownloadFile = async (key: string, fileName: string) => {
  if (downloading[key]) return;
  
  downloading[key] = true;
  try {
    const res = await downloadFileAPI(key);
    const data = res.data;
    
    if (data.code !== 0) {
      throw new Error(data.message || '获取下载链接失败');
    }
    
    const { signedUrl } = data.data;
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = signedUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    ElNotification({
      title: '开始下载',
      message: `正在下载 ${fileName}`,
      type: 'success',
    });
  } catch (error: any) {
    ElNotification({
      title: '下载失败',
      message: error.message || '文件下载失败',
      type: 'error',
    });
  } finally {
    downloading[key] = false;
  }
};

// 监听消息列表的变化并滚动到最新消息
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      const scrollEl = scrollbarRef.value.$el.querySelector('.el-scrollbar__wrap');
      scrollEl.scrollTop = scrollEl.scrollHeight;
    }
  });
};

// 自动监听 messages 数组变化（通过 watch）
import { watch } from "vue";
watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true } // 确保深度监听
);
</script>

<style scoped>
.message-box {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  background-color: var(--el-bg-color);
  height: 100%;
}

.message {
  display: flex;
  margin-bottom: 1rem;
  max-width: 70%; /* 限制消息框最大宽度 */
  word-wrap: break-word;
}

.sent-by-self {
  margin-left: auto;
  justify-content: flex-end;
}

.received {
  margin-right: auto;
  justify-content: flex-start;
}

.text {
  padding: 10px 15px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
  max-width: 100%; /* 防止消息框溢出 */
}

.sent-by-self .text {
  background-color: #2c99fb; /* 蓝色背景 */
  color: #fff;
  border-top-right-radius: 0px; /* 圆角 */
}

.received .text {
  background-color: #ffffff; /* 白色背景 */
  color: #333;
  border-top-left-radius: 0px; /* 圆角 */
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

/* 文件消息样式 */
.file-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  min-width: 200px;
  max-width: 400px;
}

.sent-by-self .file-message {
  background-color: #e3f2fd;
}

.received .file-message {
  background-color: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
}

.file-icon {
  flex-shrink: 0;
  color: var(--el-color-primary);
}

.file-content {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  word-break: break-all;
}

.file-size {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}
</style>
