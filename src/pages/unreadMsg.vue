<template>
    <div class="page-container">
        <el-card shadow="hover" class="table-card">
            <template #header>
                <div class="card-header">
                    <div class="left">
                        <h2>未读留言</h2>
                        <el-tag size="small" type="danger" v-if="notReadMessage.tableData.value.length">{{ notReadMessage.tableData.value.length }}</el-tag>
                    </div>
                    <div class="actions">
                        <el-button size="small" :loading="notReadMessage.loading.value" type="primary" @click.prevent="notReadMessage.getNotReadFeedback()" :icon="RefreshIcon">刷新</el-button>
                    </div>
                </div>
            </template>
            <el-table
                :data="notReadMessage.tableData.value"
                style="width: 100%"
                stripe
                size="small"
                :empty-text="notReadMessage.loading.value ? '加载中...' : '暂无未读留言'"
                :loading="notReadMessage.loading.value"
                highlight-current-row>
                <el-table-column prop="id" label="ID" width="90" />
                <el-table-column label="创建时间" min-width="160">
                    <template #default="{ row }">
                        {{ formatDateTimeUnixSecond(row.createdAt) }}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="署名" width="120" show-overflow-tooltip />
                <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="NavigateToReply(row.uuid)">查看/回复</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { notReadFeedbackAPI } from "@/request/api";
import { formatDateTimeUnixSecond } from "@/utils/dataUtils";
import { ElNotification } from 'element-plus';
import { Refresh as RefreshIcon } from '@element-plus/icons-vue'
import router from '@/routes';

class NotReadFeedback {
    tableData = ref<any[]>([]);
    loading = ref(false);
    getNotReadFeedback = () => {
        this.loading.value = true;
        notReadFeedbackAPI().then(
            (res) => {
                let data = res.data;
                if (data.code != 0) {
                    ElNotification({
                        title: '获取失败',
                        message: data.msg,
                        type: 'error'
                    })
                } else {
                    data = data.data;
                    this.tableData.value = data;
                }
            }
        ).catch(err => {
            ElNotification({
                title: '请求失败',
                message: err.message,
                type: 'error'
            })
        }).finally(() => this.loading.value = false)
    }
}

const notReadMessage = new NotReadFeedback();
const NavigateToReply = (uuid: string) => {
    router.push(`/read-msg/${uuid}`);
}

onMounted(() => {
    notReadMessage.getNotReadFeedback();
})
</script>
<style scoped>
.page-container { max-width: 1080px; margin: 32px auto 64px; padding: 0 16px; }
.card-header { display: flex; align-items: center; justify-content: space-between; }
.card-header h2 { margin: 0; font-size: 20px; font-weight: 600; }
.left { display: flex; align-items: center; gap: 10px; }
.table-card :deep(.el-table) { font-size: 13px; }
@media (max-width: 680px) {
    .page-container { margin-top: 20px; }
    .card-header h2 { font-size: 18px; }
    .table-card :deep(.el-table__header-wrapper) { font-size: 12px; }
}
</style>