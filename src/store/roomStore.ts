import { defineStore } from 'pinia';
import { ref } from 'vue';
import { createRoomAPI, joinRoomAPI } from '@/request/api';
import { ElNotification } from 'element-plus';

export const useRoomStore = defineStore('room', () => {
    // 房间和用户信息的响应式状态
    const curRoomId = ref('');
    const clientId = ref('');
    const clientToken = ref('');
    const inputRoomId = ref('');
    const lastRoomId = ref(localStorage.getItem('roomId') || '');
    const createRoom = async (): Promise<boolean> => {
        try {
            // 等待异步操作的结果
            const res = await createRoomAPI();
            const data = res.data;

            if (data.code != 0) {
                ElNotification({
                    title: '创建失败',
                    message: data.message,
                    type: 'error',
                });
                return false;
            } else {
                // 操作成功，更新状态
                const data = res.data.data;
                curRoomId.value = data.roomId;
                clientId.value = data.clientId;
                clientToken.value = data.clientToken;
                lastRoomId.value = data.roomId;
                localStorage.setItem("clientToken", data.clientToken);
                localStorage.setItem("roomId", data.roomId);
                localStorage.setItem("clientId", data.clientId);
                ElNotification({
                    title: '创建房间成功，房间id:' + curRoomId.value,
                    type: 'success',
                });
                return true;
            }
        } catch (err) {
            // 处理错误
            const error = err as Error;
            ElNotification({
                title: '创建房间失败',
                message: error.message,
                type: 'error',
            });
            return false;
        }
    }
    const joinRoom = async (roomId:string): Promise<boolean> => {
        try {
            const res = await joinRoomAPI(roomId);
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '加入失败',
                    message: data.message,
                    type: 'error',
                })
                return false;
            } else {
                data = data.data
                curRoomId.value = roomId;
                clientId.value = data.clientId;
                clientToken.value = data.clientToken;
                lastRoomId.value = roomId;
                localStorage.setItem("clientToken", data.clientToken);
                localStorage.setItem("roomId", roomId);
                localStorage.setItem("clientId", data.clientId);
                ElNotification({
                    title: '加入房间成功，房间id:' + roomId,
                    type: 'success',
                })
              
            }
            return true;
        }
        catch (err) {
            const error = err as Error;
            ElNotification({
                title: '加入房间失败',
                message: error.message,
                type: 'error',
            })
            return false;
        }
    }
    const reJoinRoom = () => {
        curRoomId.value = lastRoomId.value;
        clientToken.value = localStorage.getItem("clientToken") || "";
        clientId.value = localStorage.getItem("clientId") || "";
    }
    return { createRoom, joinRoom, reJoinRoom, curRoomId, clientId, clientToken, inputRoomId, lastRoomId };
});