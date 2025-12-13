// src/stores/messageStore.js
import { defineStore } from 'pinia';
import { reactive,ref } from 'vue';

interface ClientMessage {
  id: string;
  content: string;
  time: string;
  sendBySelf: boolean;
  status: string;
  error_msg: string;
  type?: 'text' | 'file'; // 消息类型
  fileInfo?: { // 文件信息（当type为file时）
    key: string;
    name: string;
    size?: number;
  };
}
export const useMessageStore = defineStore('messageStore',() => {
  const messages = ref([] as ClientMessage[]);
  const inputMessage = ref('');
  const addMessage = (msg:ClientMessage) => {
    messages.value.push(msg)
  }

  return {messages,inputMessage,addMessage}
});
