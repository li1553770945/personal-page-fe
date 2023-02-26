<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="menuWidth">
      <!-- 侧边栏菜单区域 -->
      <el-menu default-active="1" id="menu" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
        <el-radio-group id="collapse-menu-button" v-model="isCollapse">
          <el-radio-button :label="!isCollapse">|||</el-radio-button>
        </el-radio-group>
        <el-menu-item index="1" @click="openBlogWindow">
          <el-icon>
            <Notebook />
          </el-icon>
          <template #title>博客
            <el-icon>
              <top-right /> </el-icon></template>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Tools />
            </el-icon>
            <span>常用功能</span>
          </template>
          <router-link to="/file"><el-menu-item index="2-1">临时文件管理</el-menu-item></router-link>
        </el-sub-menu>
        <el-sub-menu index="10">
          <template #title>
            <el-icon>
              <User />
            </el-icon>
            <span>用户管理</span>
          </template>
          <div id="not-login" v-if="!isLogined">
            <router-link to="/login"><el-menu-item index="10-1">登录</el-menu-item></router-link>
            <router-link to="/register"><el-menu-item index="10-2">注册</el-menu-item></router-link>
          </div>
          <div id="logined" v-if="isLogined">
            <el-menu-item index="10-11">{{ nickname }}</el-menu-item>
            <div id="generate-code" v-if="role=='admin'">
              <router-link to="/generate-code"><el-menu-item index="10-12">生成激活码</el-menu-item></router-link>
            </div>
            <el-menu-item index="10-13" @click="logout">登出</el-menu-item>
          </div>
        </el-sub-menu>
      </el-menu>
    </el-aside>
  </el-container>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Notebook, TopRight, User, Tools } from "@element-plus/icons-vue";
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import { logoutAPI, userInfoAPI } from "@/request/api";
import { ElNotification } from 'element-plus'
import { onMounted } from 'vue'

const userStore = useUser()
const { isLogined, username, nickname, role } = storeToRefs(userStore)
const isCollapse = ref(false);
let menuWidth = ref(64);
const handleOpen = (key: string, keyPath: string[]) => {
  menuWidth = ref(200);
};
const handleClose = (key: string, keyPath: string[]) => {
  menuWidth = ref(64);
};

const openBlogWindow = () => {
  window.open("https://blog.peacesheep.xyz");
};


const logout = () => {
  logoutAPI().then(
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
          title: '操作成功',
          message: "已成功登出",
          type: 'success',
        })
        isLogined.value = false;
        username.value = "";
        nickname.value = "";
        role.value = ""

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

onMounted(() => {
  userInfoAPI().then(
    (res) => {
      let data = res.data;
      if (data.code != 0) {
        console.log("用户未登录");
      } else {
        data = data.data
        ElNotification({
          title: '用户状态恢复成功',
          message: "欢迎回来," + data.nickname,
          type: 'success',
        })
        isLogined.value = true;
        username.value = data.username;
        nickname.value = data.nickname;
        role.value = data.role;

      }
    }
  ).catch(
    err => {
      ElNotification({
        title: '获取用户信息请求失败',
        message: err.message,
        type: 'error',
      })
    }
  )
})
</script>
    
<style>
#menu {
  min-height: 100vh;
}


#collapse-menu-button {
  margin-left: 15px;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-right: 20px;
}
</style>