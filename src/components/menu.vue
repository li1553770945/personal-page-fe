<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="menuWidth">
      <!-- 侧边栏菜单区域 -->
      <el-menu default-active="home" id="menu" :collapse="isCollapse" @open="handleOpen" @close="handleClose">

        <div class="menu-buttons">
          <el-switch v-model="isDark" :active-action-icon="Moon" :inactive-action-icon="Sunny" class="theme-switch" />
          <el-button 
            :icon="isCollapse ? Expand : Fold" 
            @click="isCollapse = !isCollapse" 
            class="collapse-button"
            size="small"
            circle
          />
        </div>
        <router-link to="/home"><el-menu-item index="home">
            <el-icon>
              <House />
            </el-icon>
            <template #title>首页
            </template>
          </el-menu-item></router-link>
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
              <Setting />
            </el-icon>
            <span>常用功能</span>
          </template>
          <router-link to="/file"><el-menu-item index="2-1">临时文件管理</el-menu-item></router-link>
          <router-link to="/chat"><el-menu-item index="2-2">即时文本传输</el-menu-item></router-link>
        </el-sub-menu>
        <router-link to="projects">
          <el-menu-item index="projects">
            <el-icon>
              <Star />
            </el-icon>
            <template #title>项目</template>
          </el-menu-item>
        </router-link>
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
            <el-menu-item index="10-13" @click="logout">登出</el-menu-item>
          </div>
        </el-sub-menu>
        <el-sub-menu index="admin" v-if="isLogined && role == 'admin'">
          <template #title>
            <el-icon>
              <Grid />
            </el-icon>
            <span>后台管理</span>
          </template>

          <div id="generate-code">
            <router-link to="/generate-code"><el-menu-item index="10-12">生成激活码</el-menu-item></router-link>
          </div>
          <div id="unread-msg">
            <router-link to="/unread-msg"><el-menu-item index="unread-msg">未读消息</el-menu-item></router-link>
          </div>
        </el-sub-menu>
        <el-sub-menu index="contact">
          <template #title>
            <el-icon>
              <InfoFilled />
            </el-icon>
            <span>与我联系</span>
          </template>
          <el-menu-item index="email" @click="openMail">
            <el-icon>
              <Message />
            </el-icon>
            <span>邮箱 <el-icon>
                <top-right /> </el-icon></span>
          </el-menu-item>
          <el-menu-item index="github" @click="openGithub">
            <el-icon>
              <github theme="outline" size="24" fill="#333" />
            </el-icon>
            <span>Github <el-icon>
                <top-right /> </el-icon></span>
          </el-menu-item>
          <router-link to="/feedback">
            <el-menu-item index="feedback">
              <el-icon>
                <MilkTea />
              </el-icon>
              <span>咨询&留言</span>
            </el-menu-item>
          </router-link>
        </el-sub-menu>
        <router-link to="/appreciate">
          <el-menu-item index="appreciate">
            <el-icon>
              <Sugar />
            </el-icon>
            <template #title>赞赏</template>
          </el-menu-item>
        </router-link>
      </el-menu>

    </el-aside>
  </el-container>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { Notebook, TopRight, User, Setting, Message, House, Star, MilkTea, Sugar, InfoFilled, Sunny, Moon, Grid, Expand, Fold} from "@element-plus/icons-vue";
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import { logoutAPI, userInfoAPI } from "@/request/api";
import { ElNotification } from 'element-plus'
import { onMounted } from 'vue'
import { Github } from '@icon-park/vue-next';

import { useDark } from '@vueuse/core'


const userStore = useUser()
const { token, isLogined, username, nickname, role } = storeToRefs(userStore)
const isCollapse = ref(false);
let menuWidth = ref("64");

const handleOpen = (key: string, keyPath: string[]) => {
  menuWidth = ref("200");
};
const handleClose = (key: string, keyPath: string[]) => {
  menuWidth = ref("64");
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
        localStorage.removeItem("token");
        isLogined.value = false;
        username.value = "";
        nickname.value = "";
        role.value = ""
        token.value = "";

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

const fetchUserInfo = () => {
  userInfoAPI().then(
    (res) => {
      let data = res.data;
      if (data.code != 0) {
        console.log("用户未登录");
      } else {
        data = data.data
        ElNotification({
          title: '获取用户信息成功',
          message: "欢迎回来, " + data.nickname,
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
}

// 在 token 改变时重新请求用户信息
watch(token, (newToken, oldToken) => {
  if (newToken && newToken !== oldToken) {
    fetchUserInfo();
  }
})

const isDark = useDark()

const changeDarkAttribute = () => {
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
}
watch(isDark, (newValue, oldValue) => {
  changeDarkAttribute()
})

// 组件挂载时恢复用户状态
onMounted(() => {
  changeDarkAttribute();
  const tokenStoreValue = localStorage.getItem("token");
  if (tokenStoreValue) {
    token.value = tokenStoreValue;
  }
})

const openMail = () => {
  window.open("mailto:peacesheep@qq.com");
}
const openGithub = () => {
  window.open("https://github.com/li1553770945");

}
</script>

<style>
#menu {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.menu-buttons {
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  margin-top: 20px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.theme-switch {
  margin: 0;
}

.collapse-button {
  transition: all 0.3s ease;
}

.collapse-button:hover {
  transform: scale(1.1);
}

#menu .el-menu-item {
  padding: 12px 20px;
  margin: 2px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

#menu .el-menu-item:hover {
  background-color: var(--el-color-primary-light-9);
  transform: translateX(4px);
}

.el-sub-menu .el-menu-item {
  padding-left: 40px !important;
}

[data-theme="dark"] .el-menu {
  background-color: #1a1a1a;
  color: #fff;
}

[data-theme="dark"] #menu .el-menu-item:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.el-switch.is-checked .el-switch__core {
  --el-switch-on-color: var(--el-color-primary);
  --el-switch-off-color: var(--el-color-info);
}
</style>
