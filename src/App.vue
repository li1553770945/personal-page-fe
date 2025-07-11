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
            <a class="beian" href="https://beian.miit.gov.cn/" target="_blank">冀ICP备2025103290号-2</a>
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

.main-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: 100vh;
  background: var(--el-bg-color-page);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  height: 100vh;
  overflow: hidden;
}

.footer {
  padding: 16px 20px;
  text-align: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-bottom: 10px;
}

.beian {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-fast);
}

.beian:hover {
  color: var(--el-color-primary);
}

@media (max-width: 768px) {
  .main-content {
    min-width: auto;
    padding: 12px;
  }
}
</style>

