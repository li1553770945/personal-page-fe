<template>
    <div class="file">
        <el-card class="box-card" v-if="isLogined">
            <template #header>
                <div class="card-header">
                    <span>上传文件</span>
                </div>
            </template>
            <el-form :model="fileForm" label-width="120px">
                <el-form-item label="选择文件">
                    <el-upload ref="upload" class="upload-demo" method="put" :action="uploadUrl" :limit="1"
                        :on-exceed="handleExceed" :auto-upload="false" :on-change="handleFileChange"
                        :before-upload="beforeUpload">
                        <template #trigger>
                            <el-button type="primary">选择文件</el-button>
                        </template>
                        <template #tip>
                            <div class="el-upload__tip text-red">
                                最多选择一个文件
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>

                <el-form-item label="文件key">
                    <el-input v-model="fileForm.file_key" placeholder="留空自动生成" />
                </el-form-item>
                <el-form-item label="可下载次数">
                    <el-input-number v-model="fileForm.count" :min="0" :max="100" />

                    <div class="el-upload__tip text-red">
                        &nbsp; 选择0为永不消失
                    </div>

                </el-form-item>
                
                <el-form-item>
                    {{ uploadStatus }} <div v-if=" uploadStatus != '' ">，{{ uploadFileName }}的key是{{ uploadReturnFileKey }}</div>
                </el-form-item>
                
                <!-- 分享链接显示区域 -->
                <el-form-item v-if="shareLink" label="分享链接">
                    <div class="share-link-container">
                        <el-input 
                            v-model="shareLink" 
                            readonly 
                            class="share-link-input"
                            placeholder="分享链接将在这里显示"
                        />
                        <el-button 
                            type="primary" 
                            @click="copyShareLink"
                            class="copy-button"
                            :icon="iconDocumentCopy"
                        >
                            复制链接
                        </el-button>
                    </div>
                    <div class="el-upload__tip text-blue">
                        分享此链接，其他人可直接下载文件
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button class="ml-3" type="primary" @click="submitUpload">
                        上传
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <br>
        <el-divider v-if="isLogined" />
        <el-card class="box-card download-section" :class="{ 'highlight-card': isFromShareLink }">
            <template #header>
                <div class="card-header">
                    <span>下载文件（上传、删除文件登陆后可见）</span>
                    <el-tag v-if="isFromShareLink" type="success" size="small" class="share-tag">
                        来自分享链接
                    </el-tag>
                </div>
            </template>
            <el-form :model="downloadForm" label-width="120px">
                <el-form-item label="文件key">
                    <el-input 
                        v-model="downloadForm.file_key" 
                        :class="{ 'highlight-input': isFromShareLink }"
                        placeholder="输入文件key或通过分享链接自动填入"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button 
                        type="primary" 
                        @click="downloadSubmit"
                        :class="{ 'highlight-button': isFromShareLink }"
                        size="large"
                    >
                        {{ isFromShareLink ? '点击下载分享的文件' : '下载' }}
                    </el-button>
                </el-form-item>
                <el-form-item v-if="isFromShareLink">
                    <el-alert
                        title="分享文件下载提示"
                        description="文件key已自动填入，点击上方下载按钮即可开始下载"
                        type="success"
                        :closable="false"
                        show-icon
                    />
                </el-form-item>
            </el-form>
        </el-card>
        <br>
        <el-divider v-if="isLogined" />
        <el-card class="box-card" v-if="isLogined">
            <template #header>
                <div class="card-header">
                    <span>删除文件</span>
                </div>
            </template>
            <el-form :model="deleteForm" label-width="120px">
                <el-form-item label="文件key">
                    <el-input v-model="deleteForm.file_key" />
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="deleteSubmit">删除</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-dialog v-model="dialogVisible" title="确认删除">
            <span>您确定要删除文件“{{ deleteFileName }}”？</span>
            <br>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="deleteFile">确认</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElNotification, genFileId } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { fileInfoAPI, uploadFileAPI, downloadFileAPI, deleteFileAPI } from "../request/api"
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import axios from 'axios'
import { useRoute } from 'vue-router'
const userStore = useUser()
const { isLogined, username, nickname, role } = storeToRefs(userStore)
const route = useRoute()

// 注册图标组件
const iconDocumentCopy = DocumentCopy
const upload = ref<UploadInstance>()
const uploadUrl = ref("");
const fileForm = reactive({
    file_key: "",
    count: 0,
})
const dialogVisible = ref(false);
const deleteFileName = ref("");
const uploadFileName = ref("");
const uploadReturnFileKey = ref("");
const uploadStatus = ref("")
const shareLink = ref("")
const isFromShareLink = ref(false)
const downloadForm = reactive({
    file_key: "",
})
const deleteForm = reactive({
    file_key: "",
})
const handleExceed: UploadProps['onExceed'] = (files) => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

const handleFileChange = (file: { name: string }) => {
    uploadFileName.value = file.name; // 获取文件名
}

const submitUpload = () => {
    // 清理之前的分享链接
    shareLink.value = "";
    uploadStatus.value = "";
    
    uploadFileAPI({
        name: uploadFileName.value,
        key: fileForm.file_key,
        maxDownload: fileForm.count,

    }).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '获取上传url失败',
                    message: data.message,
                    type: 'error',
                })
            } else {
                data = data.data;
                uploadUrl.value = data.signedUrl;
                uploadReturnFileKey.value = data.key;
                uploadStatus.value = "上传中";
                upload.value!.submit();

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
const downloadSubmit = () => {
    downloadFileAPI(downloadForm.file_key).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '获取下载url失败',
                    message: data.message,
                    type: 'error',
                })
            } else {
                data = data.data;
                
                // 如果是从分享链接进入的，给予更友好的提示
                if (isFromShareLink.value) {
                    ElNotification({
                        title: '开始下载',
                        message: '正在打开下载链接...',
                        type: 'success',
                    });
                    // 清除高亮状态
                    isFromShareLink.value = false;
                }
                
                // 使用用户手动触发的方式打开下载链接
                const link = document.createElement('a');
                link.href = data.signedUrl;
                link.download = ''; // 触发下载而不是在新标签页打开
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
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

const deleteSubmit = () => {
    fileInfoAPI(deleteForm.file_key).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '获取文件信息失败',
                    message: data.message,
                    type: 'error',
                })
            } else {
                deleteFileName.value = data.data.name;
                dialogVisible.value = true;

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

const deleteFile = () => {
    deleteFileAPI(deleteForm.file_key).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '删除失败',
                    message: data.message,
                    type: 'error',
                })
            } else {
                ElNotification({
                    title: '删除成功',
                    type: 'success',
                })
                dialogVisible.value = false;
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

const beforeUpload = (file: any) => {
    console.log("beforeUpload");
    // 构建自定义请求体，使用二进制数据上传
    axios.put(uploadUrl.value, file, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Accept': '*/*',
            'Connection': 'keep-alive',
        },
    })
        .then(response => {
            ElNotification({
                    title: '上传成功',
                    type: 'success',
                })
                uploadStatus.value = "上传成功";
                // 生成分享链接
                shareLink.value = `${window.location.origin}/file?downloadKey=${uploadReturnFileKey.value}`;
        })
        .catch(error => {
            ElNotification({
                    title: '上传失败',
                    type: 'error',
                })
        });

    return false; // 阻止默认上传行为
}

// 检查URL参数并自动下载
const checkAutoDownload = () => {
    const downloadKey = route.query.downloadKey as string;
    if (downloadKey) {
        downloadForm.file_key = downloadKey;
        isFromShareLink.value = true;
        // 显示友好提示而不是直接下载
        ElNotification({
            title: '检测到分享文件',
            message: '已自动填入文件Key，请点击下载按钮开始下载',
            type: 'info',
            duration: 5000
        });
        
        // 滚动到下载区域
        setTimeout(() => {
            const downloadSection = document.querySelector('.download-section');
            if (downloadSection) {
                downloadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    }
}

// 复制分享链接到剪贴板
const copyShareLink = async () => {
    try {
        await navigator.clipboard.writeText(shareLink.value);
        ElNotification({
            title: '复制成功',
            message: '分享链接已复制到剪贴板',
            type: 'success',
        })
    } catch (err) {
        // 降级方案：使用旧的复制方法
        const textArea = document.createElement('textarea');
        textArea.value = shareLink.value;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            ElNotification({
                title: '复制成功',
                message: '分享链接已复制到剪贴板',
                type: 'success',
            })
        } catch (fallbackErr) {
            ElNotification({
                title: '复制失败',
                message: '请手动复制链接',
                type: 'error',
            })
        }
        document.body.removeChild(textArea);
    }
}

// 组件挂载时检查URL参数
onMounted(() => {
    checkAutoDownload();
})


</script>

<style scoped>
.file {
    width: 100%;
}

.share-link-container {
    display: flex;
    gap: 8px;
    align-items: center;
}

.share-link-input {
    flex: 1;
}

.copy-button {
    flex-shrink: 0;
}

.text-blue {
    color: #409EFF;
}

/* 分享链接高亮样式 */
.highlight-card {
    border: 2px solid #67C23A;
    box-shadow: 0 4px 12px rgba(103, 194, 58, 0.15);
    animation: gentle-pulse 2s ease-in-out infinite;
}

.highlight-input input {
    border-color: #67C23A !important;
}

.highlight-button {
    animation: button-pulse 1.5s ease-in-out infinite;
    box-shadow: 0 0 0 4px rgba(103, 194, 58, 0.3);
}

.share-tag {
    margin-left: 10px;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

@keyframes gentle-pulse {
    0%, 100% {
        box-shadow: 0 4px 12px rgba(103, 194, 58, 0.15);
    }
    50% {
        box-shadow: 0 4px 20px rgba(103, 194, 58, 0.25);
    }
}

@keyframes button-pulse {
    0%, 100% {
        box-shadow: 0 0 0 4px rgba(103, 194, 58, 0.3);
    }
    50% {
        box-shadow: 0 0 0 8px rgba(103, 194, 58, 0.1);
    }
}
</style>