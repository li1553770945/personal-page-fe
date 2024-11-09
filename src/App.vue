<template>
  <el-container>
    <el-affix>
      <Menu></Menu>
    </el-affix>
    <el-container class="main-container">
      <el-main class="main-content">
        <el-scrollbar>
          <router-view></router-view>
          <el-footer class="footer" style="text-align:center">Copyright © 2022-{{ year }} PeaceSheep<br>
            <a id="beian" href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2022004632号-1</a>
          </el-footer>
        </el-scrollbar>
      </el-main>
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
.footer {
  margin-top: 20px;
}
#beian {
  text-decoration: none;
  color: #000;
}

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* 修改此处以允许footer附着在底部 */
  align-items: center;
  height: 100vh;
  text-align: center;
}

.main-content {
  min-width: 800px;
  max-width: 1200px;
  /* 最大宽度为 1200px */
  width: 100%;
  /* 使宽度可以根据视口大小变化 */
  margin: 0 auto;
  /* 水平居中 */
}
</style>