// src/stores/messageStore.js
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('messageStore', {
  state: () => ({
    messages: [] as { content: any; id: number; sender: string; timestamp: string }[],
    sending: false,
    error: null
  }),
  actions: {
    addMessage(message: { content: any; id: number; sender: string; timestamp: string; }) {
      this.messages.push(message);
    },
    sendMessage(messageContent: any) {
      this.sending = true;
      // 假设这里是异步的发送消息逻辑
      setTimeout(() => {
        this.addMessage({
          content: messageContent,
          id: Date.now(),
          sender: 'user',
          timestamp: new Date().toISOString()
        });
        this.sending = false;
      }, 500);
    }
  },
  getters: {
    allMessages: (state) => state.messages,
    isSending: (state) => state.sending
  }
});
