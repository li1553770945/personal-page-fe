<template>
  <div class="projects">
    <div class="project-filter">
      <el-select class="filter-select" v-model="projectsPage.status_filter.value" placeholder="请选择项目状态">
        <el-option v-for="status in projectsPage.status_list" :label="status.label" :value="status.value"></el-option>
      </el-select>
      <el-select class="sort-select" v-model="projectsPage.order.value" placeholder="请选择排序方式">
        <el-option v-for="order in projectsPage.order_method_list" :label="order.label"
          :value="order.value"></el-option>
      </el-select>
      <el-button type="primary" @click="projectsPage.getProjects">查询</el-button>
      <el-button v-if="role == 'admin'" type="primary" @click="addProjectDialogVisible = true">添加项目</el-button>
    </div>
    <div class="project-list" v-if="!projectsPage.loading.value">
      <div v-for="project in projectsPage.projects" :key="project.id" class="project-item">
        <div class="project-header">
          <div class="project-title">
            <h2>{{ project.name }}</h2>
            <el-tag :key="project.status == 1 ? '开发中' : project.status == 2 ? '已完成' : '已废弃'"
              :type="project.status == 1 ? 'primary' : project.status == 2 ? 'success' : 'danger'" effect="dark"
              class="status-tag">
              {{ project.status == 1 ? '开发中' : project.status == 2 ? '已完成' : '已废弃' }}
            </el-tag>
            <div class="spacer"></div> <!-- 占位元素 -->

            <el-button class="delete-button" v-if="role == 'admin'" type="danger"
              @click="projectsPage.deleteProject(project.id)">删除</el-button>
          </div>

        </div>
        <div class="project-info">
          <span class="project-dates">{{ formatDate(project.start_date) }} - {{ project.status != 1 ?
            formatDate(project.end_date) : '现在' }}</span>
          <div class="vertical-devide">|</div>
          工作量：<el-rate v-model="project.volume_of_work" disabled />
          <div class="vertical-devide">|</div>
          难度：<el-rate v-model="project.difficulty" disabled />
          <div class="vertical-devide">|</div>
          <div class="project-link">
            <a :href="project.link" target="_blank">
              <github theme="outline" size="24" fill="#333" />
            </a>
          </div>

        </div>
        <div class="project-description">
          <p>{{ project.desc }}</p>
        </div>



      </div>

    </div>
    <el-skeleton
    v-for="index in Math.min(projectsPage.projectsNum.value, projectsPage.pageSize.value)"
      class="skeleton"
      :loading="projectsPage.loading.value"
      animated
      :throttle="200"
    ></el-skeleton>
    <div class="pagination-container">
      <el-pagination v-model:current-page="projectsPage.currentPage.value" :page-size="projectsPage.pageSize.value"
        layout="total, prev, pager, next, jumper" :total="projectsPage.projectsNum.value"
        @update:current-page="projectsPage.handleCurrentChange" />
    </div>
    <div>
      <el-dialog v-model="addProjectDialogVisible" title="添加项目">
        <el-form :model="projectsPage.newProject" label-width="auto">
          <el-form-item label="项目名称">
            <el-input v-model="projectsPage.newProject.name"></el-input>
          </el-form-item>
          <el-form-item label="项目描述">
            <el-input v-model="projectsPage.newProject.desc"></el-input>
          </el-form-item>
          <el-form-item label="项目链接">
            <el-input v-model="projectsPage.newProject.link"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="projectsPage.newProject.status" placeholder="请选择项目状态">
              <el-option v-for="status in projectsPage.new_status_list" :label="status.label"
                :value="status.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作量">
            <el-rate v-model="projectsPage.newProject.volume_of_work" />
          </el-form-item>
          <el-form-item label="难度">
            <el-rate v-model="projectsPage.newProject.difficulty" />
          </el-form-item>
          <el-form-item label="开始日期">
            <el-date-picker v-model="projectsPage.newProject.start_date" type="date" placeholder="选择开始日期" />
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker v-model="projectsPage.newProject.end_date" type="date" placeholder="选择结束日期" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addProjectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="projectsPage.addProject">确定</el-button>
        </span>
      </el-dialog>
    </div>
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
const addProjectDialogVisible = ref(false);




class ProjectsPage {
  projects = reactive<{
    id: number;
    name: string;
    desc: string;
    link: string;
    status: number;
    volume_of_work: number;
    difficulty: number;
    start_date: string;
    end_date: string;
  }[]>([]);
  projectsNum = ref(3);
  pageSize = ref(10);
  currentPage = ref(1);
  newProject = reactive({
    id: 0,
    name: "",
    desc: "",
    link: "",
    status: 1,
    volume_of_work: 1,
    difficulty: 1,
    start_date: "",
    end_date: "",
  });
  status_list = [
    { label: '全部', value: 0 },
    { label: '开发中', value: 1 },
    { label: '已完成', value: 2 },
    { label: '已废弃', value: 3 },
  ]
  status_filter = ref(0);

  order_method_list = [
    { label: '工作量升序', value: "volume_of_work_asc" },
    { label: '工作量降序', value: "volume_of_work_desc" },
    { label: '难度升序', value: "difficulty_asc" },
    { label: '难度降序', value: "difficulty_desc" },
    { label: '开始时间最新', value: "start_date_desc" },
    { label: '开始时间最旧', value: "start_date_asc" },
  ]
  order = ref("start_date_desc");

  new_status_list = [
    { label: '开发中', value: 1 },
    { label: '已完成', value: 2 },
    { label: '已废弃', value: 3 },
  ]
  loading = ref(false);

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
          addProjectDialogVisible.value = false;
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
    projectsPage.loading = ref(true);
    const start: number = (this.currentPage.value - 1) * this.pageSize.value;
    const end: number = this.currentPage.value * this.pageSize.value;
    getProjectsAPI(start, end, this.status_filter.value, this.order.value).then(
      (res) => {
        projectsPage.loading = ref(false);
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
        projectsPage.loading = ref(false);
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
  projectsPage.loading = ref(true);
  projectsPage.getProjectsNum();
  projectsPage.getProjects();
})

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getUTCFullYear(); // get the year
  const month = dateObj.getUTCMonth() + 1; // get the month (0-indexed, hence +1)
  const day = dateObj.getUTCDate(); // get the day
  return `${year}年${month.toString()}月`;
}

const statusClass = (status: number) => {
  switch (status) {
    case 1: return 'status-in-progress'; // 开发中
    case 2: return 'status-completed';   // 已完成
    case 3: return 'status-abandoned';   // 已废弃
    default: return '';
  }
}

</script>

<style scoped>
.projects {
  font-family: 'Arial', sans-serif;
  min-height: 90vh;
}

.project-item {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 4px;
  margin: 20px;
  background-color: #fafafa;
}

.project-title {
  display: flex;
  align-items: center;
  /* Aligns items vertically in the center */
  justify-content: space-between;
  margin-top: 0;
  margin-bottom: 0;

}

.project-info {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.spacer {
  flex-grow: 1;
}

h2 {
  margin-right: 8px;
  /* Adds some space between the title and the tag */
  display: inline-block;
  vertical-align: middle;
  margin-top: 0;
  margin-bottom: 0;
}

.project-filter>* {
  margin-right: 10px;
  /* 右边距 */
}

.project-filter> :last-child {
  margin-right: 0;
  /* 最后一个元素不需要右边距 */
}

.status-tag {
  margin-top: -2px;
  /* Adjusts the vertical position to appear as a superscript */
  font-size: 0.75em;
  /* Optionally reduce the font size of the tag */
}

.project-header {
  display: flex;
  flex-direction: column;
  /* Stack children vertically */
  align-items: left;
  /* Center-align items horizontally */
  justify-content: left;
  /* Center-align items vertically */
  text-align: left;
  /* Ensures text within each child is also centered */
  margin-bottom: 10px;
  /* Maintain bottom margin for spacing */
  width: 100%;
  /* Ensure it spans the full width */
}



.project-ratings {
  margin-bottom: 10px;
}

.status-completed {
  color: #28a745;
  /* Green for completed */
}

.status-in-progress {
  color: #ff8c00;
  /* Yellow for in progress */
}

.status-abandoned {
  color: #dc3545;
  /* Red for abandoned */
}

.project-divider {
  border-bottom: 1px solid #ccc;
  margin: 20px 0;
}

.project-description {
  margin-bottom: 20px;
}

.project-link {
  text-align: left;
  margin-left: 10px;
}

.pagination-container {
  display: flex;
}

.project-info {
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
}


.project-status {
  white-space: nowrap;
  padding: 3px 8px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  width: 100%;
  /* Ensure the container takes full width of its parent */
  padding: 10px 0;
  /* Optional: Adds vertical padding */
}

.filter-select {
  max-width: 150px;
}

.sort-select {
  max-width: 200px;
}

.project-description p {
  text-align: left;
  /* 确保文本左对齐 */
}

.delete-button {
  margin-left: 10px;
}

.vertical-devide {
  margin-left: 10px;
  margin-right: 10px;
}
.skeleton{
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: left;
}
</style>
