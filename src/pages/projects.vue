<template>
  <div class="projects">
    <div class="project-list">
      <el-button v-if="isLogined" type="primary" @click="projectsPage.addProjectDialogVisible.value = true">添加项目</el-button>
      <div v-for="project in projectsPage.projects" :key="project.id" class="project-item">
        <div class="project-header">
          <h2>{{ project.name }}</h2>
          {{ project.period }}
          <el-button  v-if="isLogined" type="danger" @click="projectsPage.deleteProject(project.id)">删除</el-button>
        </div>
        <div class="project-divider"></div>
        <div class="project-description">
          <p>{{ project.desc }}</p>
        </div>
        <div class="project-divider"></div>
        <div class="project-link">
          <a :href="project.link" target="_blank">
            <github theme="outline" size="24" fill="#333" />
          </a>
        </div>
      </div>
      <div class="pagination-container">
        <el-pagination v-model:current-page="projectsPage.currentPage.value" :page-size="projectsPage.pageSize.value"
          layout="total, prev, pager, next, jumper" :total="projectsPage.projectsNum.value"
          @update:current-page="projectsPage.handleCurrentChange" />
      </div>
    </div>
  </div>
  <div>
    <el-dialog title="添加项目" :visible.sync="projectsPage.addProjectDialogVisible" @confirm="projectsPage.addProject">
      <el-form :model="projectsPage.newProject">
        <el-form-item label="项目名称">
          <el-input v-model="projectsPage.newProject.name"></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="projectsPage.newProject.desc"></el-input>
        </el-form-item>
        <el-form-item label="项目链接">
          <el-input v-model="projectsPage.newProject.link"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="projectsPage.addProjectDialogVisible.value = false">取消</el-button>
        <el-button type="primary" @click="projectsPage.addProject">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">

import { Github } from '@icon-park/vue-next';

import { ref, reactive, onMounted } from 'vue';
import { getProjectsAPI, getProjectsNumAPI, deleteProjectAPI, addProjectAPI } from '@/request/api';
import { ElNotification } from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { useUser } from "../store/user"
import { storeToRefs } from 'pinia'
const userStore = useUser()
const { isLogined, username, nickname, role } = storeToRefs(userStore)




class ProjectsPage {
  projects = reactive<{
    id: number;
    name: string;
    desc: string;
    period: string;
    link: string;
  }[]>([]);
  projectsNum = ref(0);
  pageSize = ref(2);
  currentPage = ref(1);
  addProjectDialogVisible = ref(false);
  newProject = reactive({
    name: '',
    desc: '',
    link: '',
  });
  addProject = () => {
    addProjectAPI(this.newProject).then(
      (res) => {
        let data = res.data;
        if (data.code != 0) {
          ElNotification({
            title: '添加项目失败',
            message: data.msg,
            type: 'error',
          })
        } else {
          ElNotification({
            title: '添加项目成功',
            message: '添加项目成功',
            type: 'success',
          });
          this.addProjectDialogVisible.value = false;
          this.getProjectsNum();
          this.getProjects();
        }
      }
    ).catch(
      err => {
        ElNotification({
          title: '添加项目失败',
          message: err.message,
          type: 'error',
        })
      }
    )
  }

  getProjectsNum = () => {
    getProjectsNumAPI().then(
      (res) => {
        let data = res.data;
        if (data.code != 0) {
          ElNotification({
            title: '获取项目数量失败',
            message: data.msg,
            type: 'error',
          })
        } else {
          data = data.data
          this.projectsNum.value = data;
        }
      }
    ).catch(
      err => {
        ElNotification({
          title: '获取项目数量失败',
          message: err.message,
          type: 'error',
        })
      }
    )
  }

  getProjects = () => {
    const start: number = (this.currentPage.value - 1) * this.pageSize.value;
    const end: number = this.currentPage.value * this.pageSize.value;
    getProjectsAPI(start, end).then(
      (res) => {
        let data = res.data;
        if (data.code != 0) {
          ElNotification({
            title: '获取项目列表失败',
            message: data.msg,
            type: 'error',
          })
        } else {
          data = data.data
          this.projects.splice(0, this.projects.length, ...data);
        }
      }
    ).catch(
      err => {
        ElNotification({
          title: '获取项目列表失败',
          message: err.message,
          type: 'error',
        })
      }
    )
  }

  deleteProject = (id: number) => {
    ElMessageBox.confirm('确认删除该项目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteProjectAPI(id).then(
        (res) => {
          let data = res.data;
          if (data.code != 0) {
            ElNotification({
              title: '删除失败',
              message: data.msg,
              type: 'error',
            });
          } else {
            ElNotification({
              title: '删除成功',
              message: '删除成功',
              type: 'success',
            });
            this.getProjectsNum();
            this.getProjects();
          }
        }
      ).catch(
        err => {
          ElNotification({
            title: '删除失败',
            message: err.message,
            type: 'error',
          });
        }
      );
    });

  };
  handleCurrentChange = (currentPage: any) => {
    this.currentPage.value = currentPage;
    this.getProjects();
  };

}

const projectsPage = new ProjectsPage();

onMounted(() => {
  projectsPage.getProjectsNum();
  projectsPage.getProjects();
})

</script>

<style scoped>
.projects{
  height: 90vh;
}
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


.pagination-container {
  display: flex;
  justify-content: center;
}
</style>
