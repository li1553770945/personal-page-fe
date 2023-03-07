<template>
    <el-tabs v-model="tab.activeName.value" class="demo-tabs" @tab-click="tab.handleClick">
        <el-tab-pane label="回复建议" name="add-reply"></el-tab-pane>
        <el-tab-pane label="未读建议" name="not-read-message"></el-tab-pane>
    </el-tabs>
    <div class="message-form" v-if="tab.activeName.value == 'add-reply'">
        <el-form ref="formRef" :model="reply.replyForm" :rules="reply.replyRules" label-width="120px">
            <el-form-item label="消息ID" prop="message_id">
                <el-input v-model="reply.replyForm.message_id"></el-input>
            </el-form-item>
            <el-form-item label="回复内容" prop="content">
                <el-input type="textarea" v-model="reply.replyForm.content"
                    :autosize="{ minRows: 4, maxRows: 8 }"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.prevent="reply.submitForm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="not-read-message" v-if="tab.activeName.value == 'not-read-message'">

        <el-button type="primary" @click.prevent="notReadMessage.getNotReadMessage()">刷新</el-button>
        <el-table :data="notReadMessage.tableData.value" style="width: 100%">
            <el-table-column prop="ID" label="消息id" />
            <el-table-column prop="CreatedAt" label="创建时间" />
            <el-table-column prop="name" label="署名"  />
            <el-table-column prop="contact" label="联系方式" />
            <el-table-column prop="message" label="内容" />
        </el-table>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, unref, onMounted } from 'vue';
import { addReplyAPI, notReadMessageAPI } from "@/request/api";
import { ElNotification, TabsPaneContext } from 'element-plus';
const formRef = ref();


class Reply {
    replyForm = reactive({
        message_id: 0,
        content: "",
    })
    replyRules = reactive({
        message_id: [{ required: true, message: '请输入文章ID', trigger: 'blur' }],
        content: [{ required: true, message: '请输入回复内容', trigger: 'blur' },
        { min: 10, max: 1000, message: '回复内容在10-1000个字', trigger: 'blur' }],
    });
    submitForm = async () => {
        const form = unref(formRef);
        if (!form) return
        await form.validate((valid: any) => {
            if (valid) {
                this.replyForm.message_id = Number(this.replyForm.message_id);
                addReplyAPI(this.replyForm).then(
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
                                title: '回复成功',
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
            } else {
                console.log('error submit!')
            }
        })
        // 提交留言

    };

}

// 表单验证规则

class Tab {
    activeName = ref("add-reply");
    handleClick = (tab: TabsPaneContext, event: Event) => {

    }
}

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
                    console.log(this.tableData)
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

const tab = new Tab();
const notReadMessage = new NotReadMessage();
const reply = new Reply();

onMounted(() => {
    notReadMessage.getNotReadMessage();
})

</script>


