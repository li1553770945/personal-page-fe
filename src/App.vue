<template>
  <el-container>
    <el-affix>
        <Menu></Menu>
    </el-affix>
    <el-container class="main-container">
      <el-main class="main-content"><router-view></router-view></el-main>
      <el-footer style="text-align:center">Copyright © 2022-{{ year }} PeaceSheep<br>
        <a id="beian" href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2022004632号-1</a>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Menu from "./components/menu.vue"
const timeNow = new Date();
const year = timeNow.getFullYear();
</script>
  
<style scoped>
#beian {
  text-decoration: none;
  color: #000;
}
</style>