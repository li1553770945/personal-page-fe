<template>
  <el-container>
    <el-container>
      <el-aside width="200px"> <!-- 侧边栏 -->
        <Menu></Menu>
      </el-aside>
      <el-container>
        <el-main><router-view></router-view></el-main>
        <el-footer style="text-align:center">Copyright © 2022-{{year}} PeaceSheep<br>
          <a id="beian" href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2022004632号-1</a>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Menu from "./components/menu.vue"
const timeNow = new Date()
const year = timeNow.getFullYear()
</script>
  
<style scoped>
#beian {
  text-decoration: none;
  color: #000;
}
</style>