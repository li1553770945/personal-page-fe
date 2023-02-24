<template>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="menuWidth">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          default-active="1"
          id="menu"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-radio-group id="collapse-menu-button" v-model="isCollapse">
            <el-radio-button :label="!isCollapse">|||</el-radio-button>
          </el-radio-group>
          <el-menu-item index="1" @click="openBlogWindow">
            <el-icon><Notebook /></el-icon>
            <template #title
              >博客
              <el-icon>
                <top-right /> </el-icon
            ></template>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><User /></el-icon>
              <span>常用功能</span>
            </template>
            <router-link to="/file"><el-menu-item index="2-1">临时文件管理</el-menu-item></router-link>
          </el-sub-menu>
          <el-sub-menu index="10">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <router-link to="/login"><el-menu-item index="10-1">登录</el-menu-item></router-link>
            <router-link to="/register"><el-menu-item index="10-2">注册</el-menu-item></router-link>
          </el-sub-menu>
        </el-menu>
      </el-aside>
    </el-container>
  </template>
  <script lang="ts" setup>
  import { ref } from "vue";
  import { Notebook, TopRight,User} from "@element-plus/icons-vue";
  
  const isCollapse = ref(true);
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