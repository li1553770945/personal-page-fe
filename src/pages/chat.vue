<template>
    <div class="status-bar" :class="'status-bar-' + connectStatus">
        {{ statusText() }}
    </div>


    <div class="chat-container">
        <div class="header" v-if="chatID == ''">
            <el-row>
                <el-col span="4" style="margin:1rem;">
                    <el-button @click="createChat" type="primary">创建聊天</el-button>
                </el-col>
                <el-col span="8" style="margin:1rem;">
                    或
                </el-col>
                <el-col span="8" style="margin:1rem;">
                    <el-input v-model="inputChatID" placeholder="请输入聊天ID" />
                </el-col>
                <el-col span="4" style="margin:1rem;">
                    <el-button @click="joinChat(inputChatID)">加入聊天</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="header" v-if="chatID != ''">
            当前聊天ID:{{ chatID }}
            <br>
            当前客户端ID:{{ clientID }}
        </div>
        <el-scrollbar ref="scrollContainerRef" height="50vh" class="message-box">
            <div ref="scrollContentRef">
                <div v-for="message in messages" :key="message.id" class="message">
                    <el-card class="box-card"
                        :class="{ 'sent-by-self': message.sendBySelf, 'received': !message.sendBySelf }">
                        <template #header>
                            <div class="card-header">
                                <span>{{ message.sendBySelf == true ? "您" : "对方" }}于{{ message.time }}</span>
                                <el-button class="button" text @click="copy(message.content)">复制</el-button>
                            </div>
                        </template>
                        <pre> {{ message.content }}</pre>
                    </el-card>
                </div>
            </div>
        </el-scrollbar>

        <div class="input-box">
            <el-input v-model="inputMessage" class="input" placeholder="请输入消息内容，按下回车键发送" type="textarea" :rows="10"
                @keydown.enter.prevent="sendMessage" />
            <el-button @click="sendMessage" class="send-btn"
                :disabled="connectStatus != 'connected' || sending">发送</el-button>
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
  
<script lang="ts" setup>
import { reactive, ref, nextTick } from 'vue';
import { ElNotification } from 'element-plus';
import { stringify } from 'querystring';
import useClipboard from 'vue-clipboard3'

const { toClipboard } = useClipboard()
interface ClientMessage {
    id: string;
    content: string;
    time: string;
    sendBySelf: boolean,
    status: string,
    error_msg: string,
}

const sending = ref(false);
const chatID = ref('');
const inputChatID = ref('');
const clientID = ref('');
const inputMessage = ref('');
const messages: ClientMessage[] = reactive([]);
const scrollContainerRef: any = ref(null);
const scrollContentRef: any = ref(null);
const connectStatus = ref("not-connected"); // not-connected   connected  connect-interupt connect-fail
const connectRetryNum = ref(0);
const dialogVisible = ref(false);
let globalWs: WebSocket;

const handleMessage = (e: MessageEvent) => {
    const jsonString = e.data as string;
    const obj = JSON.parse(jsonString); // 解析 JSON 字符串为 JavaScript 对象
    if (obj.type == "chat_id") {
        chatID.value = obj.data;
    } else if (obj.type == "client_id") {
        clientID.value = obj.data;
    } else if (obj.type == "client_message") {
        addMsg(obj, false);
    } else if (obj.type == "error") {
        ElNotification({
            title: '错误',
            message: obj.error_msg,
            type: 'error',
        })
    } else if (obj.type == "warning") {
        ElNotification({
            title: '警告',
            message: obj.error_msg,
            type: 'warning',
        })
    }
}
const createChat = () => {
    if (window.location.host.match("localhost") != null || window.location.host.match("127.0.0.1") != null) {
        globalWs = new WebSocket('ws://' + window.location.host + "/socket/new-chat")

    }
    else {
        globalWs = new WebSocket('wss://' + window.location.host + "/socket/new-chat")

    }
    initWs(globalWs)

}
const joinChat = (joinChatID: string, joinClientID: string = "") => {
    console.log("加入聊天");
    var addr = ""
    if (window.location.host.match("localhost") != null || window.location.host.match("127.0.0.1") != null) {
        addr = "ws:"

    }
    else {
        addr = "wss:"

    }
    addr = addr + window.location.host + "/socket/join-chat?chat_id=" + joinChatID;
    if (joinClientID != "") {
        addr = addr + "&client_id=" + joinClientID;
    }

    globalWs = new WebSocket(addr);
    initWs(globalWs)
}
const sendMessage = () => {
    if (connectStatus.value != "connected") {
        ElNotification({
            title: '发送失败',
            message: "未连接至服务器,请检查连接状态",
            type: 'error',
        })
        return;
    }
    if (inputMessage.value == "") {
        ElNotification({
            title: '发送失败',
            message: "消息不能为空",
            type: 'error',
        })
        return;
    }

    const date = new Date();
    const sendMessageData = {
        "type": "client_message",
        "data": inputMessage.value,
        "time": date.toString(),
    }
    inputMessage.value = "";
    globalWs.send(JSON.stringify(sendMessageData))
    addMsg(sendMessageData, true);
}
const addMsg = (messageObj: any, sendBySelf: boolean) => {
    var msg: ClientMessage = {
        id: new Date().toDateString(),
        content: messageObj.data,
        time: formatDate(messageObj.time),
        sendBySelf: sendBySelf,
        status: "sending",
        error_msg: "",
    }
    messages.push(msg)
    if (scrollContainerRef.value != null && scrollContentRef.value != null) {
        nextTick(() => {
            scrollContainerRef.value!.setScrollTop(scrollContentRef.value!.clientHeight)
        })

    } else {
        console.log("nulllll");
    }

    // 使用原生滚动方法将容器滚动到最底部


}
const formatDate = (dateString: string) => {
    const date = new Date(dateString); // 创建一个 Date 对象
    const year = date.getFullYear(); // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份并补零
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期并补零
    const hour = String(date.getHours()).padStart(2, '0'); // 获取小时并补零
    const minute = String(date.getMinutes()).padStart(2, '0'); // 获取分钟并补零
    const second = String(date.getSeconds()).padStart(2, '0'); // 获取秒钟并补零
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // 拼接格式化后的字符串
    return formattedDate;
}
const initWs = (ws: WebSocket) => {
    //监听
    ws.addEventListener('open', handleOpen, false)
    ws.addEventListener('close', handleClose, false)
    ws.addEventListener('error', handleError, false)
    ws.addEventListener('message', handleMessage, false)
}
const statusText = () => {
    switch (connectStatus.value) {
        case "not-connected":
            return "未连接至服务器,请创建或加入对话";
        case "connected":
            return "已连接至服务器";
        case "connect-interupt":
            return "连接中断，正在尝试第" + connectRetryNum.value.toString() + "次重新连接";
        case "connect-fail":
            return "与服务器连接失败，请刷新页面并重新创建对话"
    }
}
const copy = async (text: string) => {
    try {
        await toClipboard(text)
        ElNotification({
            title: '复制成功',
            type: 'success',
        })
    } catch (e) {
        ElNotification({
            title: '复制失败',
            type: 'error',
        })
        console.log("复制失败：", e);
    }
}

function handleOpen(e: Event) {
    ElNotification({
        title: '请求成功',
        type: 'success',
        message: "websocket连接成功"
    })
    connectStatus.value = "connected";

}
function handleClose(e: CloseEvent) {
    console.log("连接已关闭")
    ElNotification({
        title: '连接失败',
        message: "websocket连接中断:" + e.code,
        type: 'error',
    })
    if (connectRetryNum.value == 4 || chatID.value == "") {
        dialogVisible.value = true;
        nextTick(() => {
            connectStatus.value = "connect-fail";
        })
        return;
    } else {
        nextTick(() => {
            connectStatus.value = "connect-interupt";
        })
        connectRetryNum.value = connectRetryNum.value + 1;
        joinChat(chatID.value, clientID.value);
    }

}
function handleError(e: Event) {

    ElNotification({
        title: '请求失败',
        message: "websocket连接失败",
        type: 'error',
    })
    nextTick(() => {
        console.log("连接失败")
        connectStatus.value = "connect-fail";
    })
}
</script>
  
<style scoped>
.chat-container {
    max-width: 1000px;
    margin: 0 auto;
}

.header {
    margin-bottom: 1rem;
}

.message-box {
    border: 1px solid #2d2b2b;
    border-radius: 4px;
    padding: 1rem;
    overflow-y: auto;
    min-height: 50vh;
    max-height: 50vh;
}

.message {
    display: flex;
    margin-bottom: 1rem;
}



.sent-by-self {
    margin-left: auto;
    margin-right: 10px;
}

.received {
    margin-right: auto;
    margin-left: 10px;
}

.text {
    margin-bottom: 0.5rem;
}



.input-box {
    display: flex;
    align-items: center;
    margin-top: 1rem;
}

.input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 0.5rem;
}

.send-btn {
    background-color: #409eff;
    color: #fff;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.status-bar {
    /* 设置顶部文字的样式 */
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
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
  