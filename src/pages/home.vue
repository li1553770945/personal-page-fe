<template>
  <div class="home">
    <el-container class="info">
      <!-- <el-aside width="200px">Aside</el-aside> -->
      <el-main>
        <el-row class="name">
          <h2>李亚宁</h2>
        </el-row>
        <el-row class="education-info">
          东南大学 硕士 电子信息
        </el-row>
      </el-main>
    </el-container>
    <el-container class="work">
      <el-main>
        <el-row class="name">
          <h3>工作经历</h3>
        </el-row>
        <el-row class="education-info">
          深圳市腾讯计算机系统有限公司
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
const work = [
  {
    company: '深圳市腾讯计算机系统有限公司',
    city: '深圳',
    department: '魔方工作室',
    position: '后台开发',
    time: '2020.10-至今',
    description: '使用 C++语言，设计开发一款对象存储系统。项目使用分布式架构，支持多租户隔离，支持百万级文件存储，利用 epoll 的 IO 多路复用机制，综合使用 TCP 和 UDP 协议，具有高性能、高可用等特点'
  }

]
</script>

<style scoped>
.home {
  width: 100%;
  text-align: left;
}

.subtile {
  font-size: 20px;
  color: aqua;
}
</style>
