<template>
  <el-scrollbar ref="scrollbarRef" class="message-box" height="50vh">
    <div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="['message', msg.sendBySelf ? 'sent-by-self' : 'received']"
      >
        <div class="text">{{ msg.content }}</div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { useMessageStore } from "../../store/messageStore";
import { nextTick, ref } from "vue";

const { messages } = useMessageStore();
const scrollbarRef = ref(null);

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
  border: 1px solid #2d2b2b;
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
  min-height: 50vh;
  max-height: 50vh;
  background-color: #f5f5f5;
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
</style>
