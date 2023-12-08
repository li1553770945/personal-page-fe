<template>
    <div class="not-read-message">
        <el-button type="primary" @click.prevent="notReadMessage.getNotReadMessage()">刷新</el-button>
        <el-table :data="notReadMessage.tableData.value" style="width: 100%">
            <el-table-column prop="id" label="消息id" />
            <el-table-column label="创建时间">
                <template v-slot="{ row }">
                    {{ formatDate(row.created_at) }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="署名" />
            <el-table-column prop="title" label="标题" />
            <el-table-column>
                <template v-slot="{ row }">
                    <el-button type="primary" size="small" @click="NavigateToReply(row.uuid)">查看/回复</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { notReadMessageAPI } from "@/request/api";
import { formatDate } from "@/utils/dataUtils";
import { ElNotification } from 'element-plus';
import router from '@/routes';

const formRef = ref();

class NotReadMessage {
    tableData = ref([]);
    getNotReadMessage = () => {
        notReadMessageAPI().then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '操作失败',
                        message: data.msg,
                        type: 'error',
                    })
                } else {
                    data = data.data
                    ElNotification({
                        title: '拉取未读消息数据成功',
                        type: 'success',
                    })
                    this.tableData.value = data;
                }
            }
        ).catch(
            err => {
                ElNotification({
                    title: '请求失败',
                    message: err.message,
                    type: 'error',
                })
            }
        )
    }
}

const notReadMessage = new NotReadMessage();
const NavigateToReply = (uuid: string) => {
    console.log(uuid);
    router.push(`/read-msg/${uuid}`);
}

onMounted(() => {
    notReadMessage.getNotReadMessage();
})

</script>


<style scoped></style>