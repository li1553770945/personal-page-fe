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
}
export const useMessageStore = defineStore('messageStore',() => {
  const messages = ref([] as ClientMessage[]);
  const inputMessage = ref('');
  const addMessage = (msg:ClientMessage) => {
    messages.value.push(msg)
  }

  return {messages,inputMessage,addMessage}
});
