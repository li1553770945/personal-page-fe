<template>
  <div class="profile-page">
    <el-card class="profile-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-tag v-if="role" effect="dark" :type="roleTagType">{{ roleLabel }}</el-tag>
        </div>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ username || '-' }}</el-descriptions-item>
        <el-descriptions-item label="昵称">
          <div class="nickname-row">
            <span>{{ nickname || '-' }}</span>
            <el-input v-if="isEditingNickname" v-model="newNickname" size="small" class="nickname-input" />
            <!-- <el-button v-if="!isEditingNickname" size="small" type="primary" link @click="startEditNickname" :disabled="!isLogined">修改</el-button> -->
            <!-- <div v-else class="edit-actions">
              <el-button size="small" type="primary" @click="saveNickname" :loading="saving">保存</el-button>
              <el-button size="small" @click="cancelEdit" :disabled="saving">取消</el-button>
            </div> -->
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="角色">{{ roleLabel }}</el-descriptions-item>
        <el-descriptions-item label="登录状态">
          <el-tag :type="isLogined ? 'success' : 'info'">{{ isLogined ? '已登录' : '未登录' }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <div class="actions">
        <el-button type="primary" @click="refreshUserInfo" :loading="loadingUser">刷新信息</el-button>
        <el-button v-if="isLogined" type="danger" @click="logout">退出登录</el-button>
        <router-link v-else to="/login"><el-button type="success">前往登录</el-button></router-link>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUser } from '@/store/user';
import { userInfoAPI, logoutAPI } from '@/request/api';
import { ElNotification } from 'element-plus';

const userStore = useUser();
const { username, nickname, role, isLogined, token } = storeToRefs(userStore);

const loadingUser = ref(false);
const saving = ref(false);

const roleLabel = computed(() => {
  if (!role.value) return '-';
  if (role.value === 'admin') return '管理员';
  return '用户';
});

const roleTagType = computed(() => role.value === 'admin' ? 'warning' : 'info');

// 昵称编辑
const isEditingNickname = ref(false);
const newNickname = ref('');

const startEditNickname = () => {
  newNickname.value = nickname.value;
  isEditingNickname.value = true;
};
const cancelEdit = () => {
  isEditingNickname.value = false;
};
const saveNickname = () => {
  // TODO: 调用更新昵称接口
  saving.value = true;
  setTimeout(() => {
    nickname.value = newNickname.value;
    isEditingNickname.value = false;
    saving.value = false;
    ElNotification({ title: '成功', message: '昵称已更新 (前端暂存)', type: 'success' });
  }, 600);
};

const refreshUserInfo = () => {
  loadingUser.value = true;
  userInfoAPI().then(res => {
    const data = res.data;
    if (data.code === 0) {
      const u = data.data;
      username.value = u.username;
      nickname.value = u.nickname;
      role.value = u.role;
      isLogined.value = true;
      ElNotification({ title: '成功', message: '用户信息已刷新', type: 'success' });
    } else {
      ElNotification({ title: '失败', message: data.msg, type: 'error' });
    }
  }).catch(err => {
    ElNotification({ title: '请求失败', message: err.message, type: 'error' });
  }).finally(() => loadingUser.value = false);
};

const logout = () => {
  logoutAPI().then(res => {
    const data = res.data;
    if (data.code === 0) {
      localStorage.removeItem('token');
      token.value = '';
      isLogined.value = false;
      username.value = '';
      nickname.value = '';
      role.value = '';
      ElNotification({ title: '已退出', message: '成功退出登录', type: 'success' });
    } else {
      ElNotification({ title: '登出失败', message: data.msg, type: 'error' });
    }
  }).catch(err => {
    ElNotification({ title: '登出请求错误', message: err.message, type: 'error' });
  });
};

onMounted(() => {
  if (!isLogined.value) {
    refreshUserInfo();
  }
});
</script>

<style scoped>
.profile-page { padding: 24px; display: flex; justify-content: center; }
.profile-card { max-width: 640px; width: 100%; }
.card-header { display: flex; align-items: center; gap: 12px; font-weight: 600; }
.actions { margin-top: 24px; display: flex; gap: 12px; }
.nickname-row { display: flex; align-items: center; gap: 8px; }
.nickname-input { width: 160px; }
.edit-actions { display: flex; gap: 6px; }
</style>
