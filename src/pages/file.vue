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
                        选择0为永不消失
                    </div>

                </el-form-item>
                
                <el-form-item>
                    {{ uploadStatus }} <div v-if=" uploadStatus != '' ">，{{ uploadFileName }}的key是{{ uploadReturnFileKey }}</div>
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
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span>下载文件（上传、删除文件登陆后可见）</span>
                </div>
            </template>
            <el-form :model="downloadForm" label-width="120px">
                <el-form-item label="文件key">
                    <el-input v-model="downloadForm.file_key" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="downloadSubmit">下载</el-button>
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
import { ref, reactive } from 'vue'
import { ElNotification, genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { fileInfoAPI, uploadFileAPI, downloadFileAPI, deleteFileAPI } from "../request/api"
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import axios from 'axios'
const userStore = useUser()
const { isLogined, username, nickname, role } = storeToRefs(userStore)
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
                const link = document.createElement('a'); // 创建一个 <a> 标签
                link.href = data.signedUrl; // 设置文件下载地址
                link.download = data.name; // 设置下载时文件的名称
                document.body.appendChild(link); // 将 <a> 标签添加到页面中
                console.log(link.href);
                console.log(link.download);
                link.click(); // 模拟点击下载
                document.body.removeChild(link); // 下载完成后移除 <a> 标签
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
        })
        .catch(error => {
            ElNotification({
                    title: '上传失败',
                    type: 'success',
                })
        });

    return false; // 阻止默认上传行为
}

const handleSuccess = (res: any, _file: any, _files: any) => {
    if (res['code'] != 0) {
        ElNotification({
            title: '上传失败',
            message: res['msg'],
            type: 'error',
        })
    } else {
        ElNotification({
            title: '上传成功',
            type: 'success',
        })
        uploadStatus.value = "上传成功";
    }
}
const handleError = (error: any, _file: any, _files: any) => {
    ElNotification({
        title: '上传失败',
        message: error,
        type: 'error',
    })
    uploadStatus.value = "上传失败";
}
</script>

<style scoped>
.file {
    width: 100%;
}
</style>