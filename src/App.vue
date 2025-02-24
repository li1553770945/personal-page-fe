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
            <a class="beian" href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2025103290号-1</a>
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
.beian {
  color: inherit; /* 继承父元素的颜色 */
  text-decoration: none; /* 如果你不希望链接有下划线，也可以加上这个 */
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
  width: 100%;
  margin: 0 auto;
}
</style>

