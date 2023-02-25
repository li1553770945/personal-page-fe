<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>上传文件</span>
            </div>
        </template>
        <el-form :model="fileForm" label-width="120px">
            <el-form-item label="选择文件">
                <el-upload ref="upload" class="upload-demo" action="/api/upload-file" :limit="1" :on-exceed="handleExceed"
                    :auto-upload="false" :data="fileForm" :on-success="handleSuccess" :on-error="handleError">
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
                <el-button class="ml-3" type="primary" @click="submitUpload">
                    上传
                </el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <br>
    <el-divider />
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>下载文件</span>
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
    <el-divider />
    <el-card class="box-card">
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
</template>
  
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElNotification, genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { fileInfoAPI, deleteFileAPI } from "../request/api"
const upload = ref<UploadInstance>()
const fileForm = reactive({
    file_key: "",
    count: 0,
})

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

const submitUpload = () => {
    upload.value!.submit()
}
const downloadSubmit = () => {
    fileInfoAPI(downloadForm.file_key).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '下载失败',
                    message: data.msg,
                    type: 'error',
                })
            } else {
                window.open("/api/download-file?file_key=" + downloadForm.file_key);

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
    deleteFileAPI(deleteForm.file_key).then(
        (res) => {
            let data = res.data;
            if (data.code != 0) {
                ElNotification({
                    title: '删除失败',
                    message: data.msg,
                    type: 'error',
                })
            } else {
                ElNotification({
                    title: '删除成功',
                    type: 'success',
                })

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

    }
}
const handleError = (error: any, _file: any, _files: any) => {
    ElNotification({
        title: '上传失败',
        message: error,
        type: 'error',
    })
}
</script>