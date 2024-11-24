<template>
    <div class="status-bar" :class="'status-bar-' + connect.connectStatus">
        {{ connect.statusText() }}
    </div>


    <div class="chat-container">
        <div class="header" v-if="room.roomId.value == '' || connect.connectStatus.value != 'connected'">
            <el-row>
                <el-col span="4" style="margin:1rem;">
                    <el-button @click="room.createRoom()" type="primary">创建聊天</el-button>
                </el-col>
                <el-col span="8" style="margin:1rem;">
                    或
                </el-col>
                <el-col span="4" style="margin:1rem;">
                    <el-input v-model="room.inputRoomId.value" placeholder="请输入聊天ID" />
                </el-col>
                <el-col span="4" style="margin:1rem;">
                    <el-button @click="room.joinRoom()">加入聊天</el-button>
                </el-col>
                <el-col span="4" style="margin:1rem;" v-if="room.lastRoomId.value">
                    <el-button @click="room.reJoinRoom()">重新加入聊天{{ room.lastRoomId }}</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="header" v-if="room.roomId.value != '' && connect.connectStatus.value == 'connected'">
            当前聊天ID:{{ room.roomId }}
            <br>
            当前客户端ID:{{ room.clientId }}
        </div>
        <el-scrollbar ref="scrollContainerRef" height="50vh" class="message-box">
            <div ref="scrollContentRef">
                <div v-for="messageObj in message.messages" :key="messageObj.id" class="message">
                    <el-card class="box-card"
                        :class="{ 'sent-by-self': messageObj.sendBySelf, 'received': !messageObj.sendBySelf }">
                        <template #header>
                            <div class="card-header">
                                <span>{{ messageObj.sendBySelf == true ? "您" : "对方" }}于{{ messageObj.time }}</span>
                                <el-button class="button" text @click="message.copy(messageObj.content)">复制</el-button>
                            </div>
                        </template>
                        <pre> {{ messageObj.content }}</pre>
                    </el-card>
                </div>
            </div>
        </el-scrollbar>

        <div class="input-box">
            <el-input v-model="message.inputMessage.value" class="input" placeholder="请输入消息内容，按下回车键发送" type="textarea"
                :rows="10" @keydown.enter.prevent="message.sendMessage()" />
            <el-button @click="message.sendMessage()" class="send-btn"
                :disabled="connect.connectStatus != 'connected' || message.sending">发送</el-button>
        </div>
    </div>

    <el-dialog v-model="connect.dialogVisible.value" title="连接失败" width="30%">

        <span>与服务器连接失败，请刷新页面并重新创建对话</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="connect.dialogVisible.value = false" type="primary">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from 'vue';
import { ElNotification } from 'element-plus';
import { createRoomAPI, joinRoomAPI } from '@/request/api';
import useClipboard from 'vue-clipboard3'
const wsBaseURL = import.meta.env.VITE_WS_BASE_URL;
const { toClipboard } = useClipboard()
interface ClientMessage {
    id: string;
    content: string;
    time: string;
    sendBySelf: boolean,
    status: string,
    error_msg: string,
}





class Room {
    private connecter: Connecter;

    constructor(connecter: Connecter) {
        this.connecter = connecter;
    }


    roomId = ref('');
    inputRoomId = ref('');
    clientId = ref('');
    clientToken = ref('');
    lastRoomId = ref(localStorage.getItem("roomId") || "");
    
}
class Connecter {
    globalWs: WebSocket = new WebSocket(wsBaseURL);
    connectStatus = ref("not-connected"); // not-connected   connected  connect-interupt connect-fail
    connectRetryNum = ref(0);
    dialogVisible = ref(false);


    
}
class Message {
    sending = ref(false);

    inputMessage = ref('');
    messages: ClientMessage[] = reactive([]);
    scrollContainerRef: any = ref(null);
    scrollContentRef: any = ref(null);

    sendMessage = () => {
        if (connect.connectStatus.value != "connected") {
            ElNotification({
                title: '发送失败',
                message: "未连接至服务器,请检查连接状态",
                type: 'error',
            })
            return;
        }
        if (this.inputMessage.value == "") {
            ElNotification({
                title: '发送失败',
                message: "消息不能为空",
                type: 'error',
            })
            return;
        }

        const sendMessageData = {
            "event": "im-message",
            "type": "text",
            "data": this.inputMessage.value,
        }
        connect.sendMessage(JSON.stringify(sendMessageData));
        this.addMsg(sendMessageData, true);
    }
    addMsg = (messageObj: any, sendBySelf: boolean) => {
        var msg: ClientMessage = {
            id: new Date().toDateString(),
            content: messageObj.data,
            time: "",
            sendBySelf: sendBySelf,
            status: "sending",
            error_msg: "",
        }
        this.messages.push(msg)
        if (this.scrollContainerRef.value != null && this.scrollContentRef.value != null) {
            nextTick(() => {
                this.scrollContainerRef.value!.setScrollTop(this.scrollContentRef.value!.clientHeight)
            })

        }
    }

    copy = async (text: string) => {
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
}

const message = new Message();
const connecter = new Connecter();
const room = new Room(connecter);



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