<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="menuWidth">
      <!-- 侧边栏菜单区域 -->
      <el-menu default-active="home" id="menu" :collapse="isCollapse" @open="handleOpen" @close="handleClose">
        <el-radio-group id="collapse-menu-button" v-model="isCollapse">
          <el-radio-button :label="!isCollapse">|||</el-radio-button>
        </el-radio-group>
        <router-link to="/home"><el-menu-item index="home">
            <el-icon>
              <House />
            </el-icon>
            <template #title>主页
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
            <div id="generate-code" v-if="role == 'admin'">
              <router-link to="/generate-code"><el-menu-item index="10-12">生成激活码</el-menu-item></router-link>
            </div>
            <el-menu-item index="10-13" @click="logout">登出</el-menu-item>
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
            <span>邮箱</span>
          </el-menu-item>
          <el-menu-item index="github" @click="openGithub">
            <el-icon>
              <github theme="outline" size="24" fill="#333" />
            </el-icon>
            <span>Github</span>
          </el-menu-item>
          <router-link to="/message-box">
            <el-menu-item index="message-box">
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
import { ref } from "vue";
import { Notebook, TopRight, User,Setting, Message, House, Comment,MilkTea,Sugar } from "@element-plus/icons-vue";
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
import { logoutAPI, userInfoAPI } from "@/request/api";
import { ElNotification } from 'element-plus'
import { onMounted } from 'vue'
import { Github } from '@icon-park/vue-next';
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
}


#collapse-menu-button {
  margin-left: 15px;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-right: 20px;
}

#contact-me {
  text-align: center;
}
</style>