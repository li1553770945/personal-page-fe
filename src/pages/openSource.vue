<template>
  <div class="project-list">
    <el-scrollbar class="scrollbar">
      <div v-for="project in projects" :key="project.id" class="project-item">
        <div class="project-header">
          <h2>{{ project.name }}</h2>
        </div>
        <div class="project-divider"></div>
        <div class="project-description">
          <p>{{ project.description }}</p>
        </div>
        <div class="project-divider"></div>
        <div class="project-link">
          <a :href="project.githubLink" target="_blank">
            <github theme="outline" size="24" fill="#333" />
          </a>
        </div>
      </div>
    </el-scrollbar>


    <el-pagination v-model:current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
      :total="totalItems" @current-change="handleCurrentChange" />
  </div>
</template>

<script setup lang="ts">

import { Github } from '@icon-park/vue-next';

import { ref, reactive, onMounted } from 'vue';



const handleCurrentChange = () => { };
const totalItems = 0;
const pageSize = 10;
const currentPage = 1;

const projects = reactive(
  [
    {
      id: 1,
      name: "Project 1",
      description: "Description of Project 1",
      backgroundImage: "https://via.placeholder.com/150",
      githubLink: "",
    },
    {
      id: 1,
      name: "Project 1",
      description: "Description of Project 1",
      backgroundImage: "https://via.placeholder.com/150",
      githubLink: "",
    },
    {
      id: 1,
      name: "Project 1",
      description: "Description of Project 1",
      backgroundImage: "https://via.placeholder.com/150",
      githubLink: "",
    },
    {
      id: 1,
      name: "Project 1",
      description: "Description of Project 1",
      backgroundImage: "https://via.placeholder.com/150",
      githubLink: "",
    },
    {
      id: 1,
      name: "Project 1",
      description: "Description of Project 1",
      backgroundImage: "https://via.placeholder.com/150",
      githubLink: "",
    },
    {
      id: 1,
      name: "Project 1",
      description: "Description of Project 1",
      backgroundImage: "https://via.placeholder.com/150",
      githubLink: "",
    },
    {
      id: 1,
      name: "Project 1",
      description: "Description of Project 1",
      backgroundImage: "https://via.placeholder.com/150",
      githubLink: "",
    },
  ]);
</script>

<style scoped>

.project-item {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 4px;
  margin: 20px;
}

.project-header {
  text-align: center;
  margin-bottom: 10px;
}

.project-divider {
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
}

.project-description {
  margin-bottom: 10px;
}

.project-link {
  text-align: center;
}

.scrollbar{
  height: 100vh;
  overflow: auto;
}
</style>
