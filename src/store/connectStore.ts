// stores/connectStore.ts
import { defineStore, storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { ElNotification } from "element-plus";
import { useRoomStore } from "@/store/roomStore";
import { useMessageStore } from "@/store/messageStore";
const { curRoomId, clientToken } = storeToRefs(useRoomStore());
const messageStore = useMessageStore();
const { addMessage } = messageStore;
const { inputMessage } = storeToRefs(messageStore);
const wsBaseURL = import.meta.env.VITE_WS_BASE_URL;

export const useConnectStore = defineStore("connect", () => {
  const globalWs = ref<WebSocket | null>(null);
  const connectionStatus = ref("not-connected"); // 连接状态
  const retryCount = ref(0); // 重试次数
  const dialogVisible = ref(false); // 对话框是否可见
  const sending = ref(false);

  // 计算连接状态和状态文本
  const statusText = computed(() => {
    switch (connectionStatus.value) {
      case "connected":
        return "已连接至服务器";
      case "not-connected":
        return "未连接至服务器，请创建或加入对话";
      case "connect-interupt":
        return `连接中断，正在尝试第${retryCount.value}次重新连接`;
      case "connect-fail":
        return "与服务器连接失败，请刷新页面并重新创建对话";
    }
  });

  const connect = (roomId: string = "") => {
    let addr = `${wsBaseURL}/connect?roomId=${roomId}`;
    globalWs.value = new WebSocket(addr);
    globalWs.value.addEventListener("open", handleOpen, false);
    globalWs.value.addEventListener("close", handleClose, false);
    globalWs.value.addEventListener("error", handleError, false);
    globalWs.value.addEventListener("message", handleEvent, false);
  };

  const handleEvent = (e: MessageEvent) => {
    const jsonString = e.data as string;
    const obj = JSON.parse(jsonString); // 解析 JSON 字符串为 JavaScript 对象
    if (obj.event == "im-message") {
      handleMessage(obj);
    } else if (obj.event == "im-auth-resp") {
      ElNotification({
        title: "连接成功",
        type: "success",
        message: "websocket连接成功",
      });
      connectionStatus.value = "connected";
    } else if (obj.event == "im-error") {
      ElNotification({
        title: "错误",
        message: obj.data,
        type: "error",
      });
    } else if (obj.event == "im-close") {
      ElNotification({
        title: "连接失败",
        message: obj.data,
        type: "error",
      });
      connectionStatus.value = "connect-fail";
      dialogVisible.value = true;
      globalWs.value?.close();
    }
  };
  const handleMessage = (obj: { type: string; data: string }) => {
    switch (obj.type) {
      case "text":
        const msg = {
          id: new Date().toDateString(),
          content: obj.data,
          time: "",
          sendBySelf: false,
          status: "",
          error_msg: "",
        };
        addMessage(msg);
        break;
      default:
        console.log("未知消息类型", obj.type);
    }
  };
  const handleClose = (e: CloseEvent) => {
    console.log("连接已关闭");
    if (globalWs.value) {
      globalWs.value.close();
    }
    connectionStatus.value = "connect-interupt";
    ElNotification({
      title: "连接已关闭",
      message: "websocket连接关闭，状态码:" + e.code,
      type: "warning",
    });
    globalWs.value?.close();
    globalWs.value = null;
  };
  const handleOpen = (e: Event) => {
    globalWs.value?.send(
      JSON.stringify({ event: "im-auth-req", data: clientToken.value })
    );
  };
  const handleError = (e: Event) => {
    ElNotification({
      title: "连接失败",
      message: `websocket连接中断:${e}，正在进行第${retryCount.value}次重连`,
      type: "error",
    });
    if (retryCount.value == 4 || curRoomId.value == "") {
      dialogVisible.value = true;
      connectionStatus.value = "connect-fail";
      globalWs.value?.close();
      globalWs.value = null;
    } else {
      connectionStatus.value = "connect-interupt";
      retryCount.value = retryCount.value + 1;
      connect(curRoomId.value);
    }
  };
  const sendMessage = (content: string): boolean => {
    if (globalWs.value) {
      sending.value = true;
      globalWs.value.send(
        JSON.stringify({ event: "im-message", type: "text", data: content })
      );
      addMessage({
        id: Date.now().toString(),
        content,
        time: new Date().toLocaleString(),
        sendBySelf: true,
        status: "sending",
        error_msg: "",
      });
      return true;
    } else {
      sending.value = false;
      ElNotification({
        title: "发送失败",
        message: "websocket连接未建立",
        type: "error",
      });
      return false;
    }
  };
  return {
    connect,
    globalWs,
    connectionStatus,
    retryCount,
    dialogVisible,
    statusText,
    sendMessage,
  };
});