<template>
  <el-container>
    <!-- 侧边栏 -->
    <Menu></Menu>
    <el-main><router-view></router-view></el-main>
  </el-container>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Menu from "./components/menu.vue"

</script>
  
<style>
</style>