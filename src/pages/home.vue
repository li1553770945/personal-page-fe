<template>
  <div class="home">
    <div class="hero-section">
      <div class="profile-card">
        <div class="profile-header">
          <h1 class="name">李亚宁</h1>
          <p class="title">后端开发工程师 / 研究生</p>
        </div>
      </div>
    </div>

    <div class="content-sections">
      <!-- 教育经历 -->
      <section class="section education-section">
        <h2 class="section-title">
          <el-icon><Reading /></el-icon>
          教育经历
        </h2>
        <el-timeline>
          <el-timeline-item v-for="item in education" :key="item.id" :timestamp="item.time" placement="top"
            :color="item.is_current ? '#409EFF' : '#67C23A'">
            <div class="timeline-card">
              <div class="education-header">
                <h3>{{ item.school }} {{ item.college }}</h3>
                <el-tag :type="item.is_current ? 'primary' : 'success'" size="small">
                  {{ item.degree }} · {{ item.major }}
                </el-tag>
              </div>
              <div class="timeline-content">
                <p><strong>主修课程：</strong>{{ item.course }}</p>
                <p><strong>荣誉奖项：</strong>{{ item.reward }}</p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </section>

      <!-- 工作经历 -->
      <section class="section work-section">
        <h2 class="section-title">
          <el-icon><Briefcase /></el-icon>
          工作/实习经历
        </h2>
        <el-timeline>
          <el-timeline-item v-for="item in work" :key="item.company" :timestamp="item.time" placement="top"
            :color="item.is_current ? '#409EFF' : '#67C23A'">
            <div class="timeline-card">
              <div class="work-header">
                <h3>{{ item.company }} · {{ item.department }}</h3>
                <div class="work-tags">
                  <el-tag :type="item.type === '实习' ? 'info' : 'success'" size="small">
                    {{ item.type }}
                  </el-tag>
                  <el-tag type="primary" size="small">{{ item.position }}</el-tag>
                </div>
              </div>
              <div class="timeline-content">
                <p>{{ item.description }}</p>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </section>

      <!-- 竞赛获奖 -->
      <section class="section contests-section">
        <h2 class="section-title">
          <el-icon><Trophy /></el-icon>
          竞赛获奖
        </h2>
        <div class="contests-grid">
          <div v-for="item in contests" :key="item.name" class="contest-item">
            <el-icon class="contest-icon"><Medal /></el-icon>
            <div class="contest-content">
              <h4>{{ item.name }}</h4>
              <span class="contest-level">{{ item.level }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 论文发表 -->
      <section class="section papers-section">
        <h2 class="section-title">
          <el-icon><Document /></el-icon>
          论文发表
        </h2>
        <div class="papers-list">
          <div v-for="item in papers" :key="item.content" class="paper-item">
            <div class="paper-content" v-html="item.content"></div>
            <el-tag class="paper-level" type="warning" size="small">{{ item.level }}</el-tag>
          </div>
        </div>
      </section>

      <!-- 技能 -->
      <section class="section skills-section">
        <h2 class="section-title">
          <el-icon><Tools /></el-icon>
          技能
        </h2>
        <div class="skills-grid">
          <div v-for="item in skills" :key="item.name" class="skill-item">
            <div class="skill-icon" :style="{ backgroundImage: 'url(' + item.icon + ')' }"></div>
            <div class="skill-content">
              <h4>{{ item.name }}</h4>
              <el-tag :type="badge_type[item.type]" size="small">
                {{ badge_name[item.type] }}
              </el-tag>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Reading, Briefcase, Trophy, Medal, Document, Tools } from '@element-plus/icons-vue';

import cppIcon from '@/assets/icons/home/cpp.svg';
import vueIcon from '@/assets/icons/home/vue.svg';
import luaIcon from '@/assets/icons/home/lua.svg';
import golangIcon from '@/assets/icons/home/golang.svg';
import pythonIcon from '@/assets/icons/home/python.svg';
import javaIcon from '@/assets/icons/home/java.svg';
import gitIcon from '@/assets/icons/home/git.svg';
import cmakeIcon from '@/assets/icons/home/cmake.svg';
import DockerIcon from '@/assets/icons/home/Docker.svg';
import K8sIcon from '@/assets/icons/home/k8s.svg';
import { Level } from '@icon-park/vue-next';
import { onMounted } from 'vue';
import RoutePreloader from '@/utils/routePreloader';

// 在组件挂载后启动预加载
onMounted(() => {
  // 延迟1.5秒后开始预加载，确保首页渲染完成
  setTimeout(() => {
    if (!RoutePreloader.isPreloadComplete() && !RoutePreloader.isCurrentlyPreloading()) {
      RoutePreloader.preloadAll();
    }
  }, 1500);
});

const work = [
{
    id: 2,
    company: '阿里巴巴',
    city: '杭州',
    department: '爱橙科技',
    position: '分布式基础基础',
    time: '2025年4月-今',
    description: '负责阿里网关Higressd的MCP协议适配工作，使用Go编写Envoy插件并以动态库形式加载，从网关层面将阿里现有HSF服务以MCP协议形式暴露，使得Agent能够直接调用阿里现有微服务。优化原有插件编译流程，单次测试时间从10分钟降低到小于1分钟，编写了多语言网关端到端测试，完成了插件的CI流程设计，使用OTEL和Grafana实现MCPServer指标监控，并配合开发MCPServer管理页面前后端',
    is_current: true,
    type:"实习",
  },
  {
    id: 1,
    company: '字节跳动',
    city: '南京',
    department: 'Data部门',
    position: '后端开发',
    time: '2022年11月-2023年2月',
    description: '为字节跳动商业化数据平台后端开发 RPC 服务，将现有项目的Kitex依赖从本地重构为 overpass，极大缩短微服务版本升级流程。采用 Google 开源组件库 go-wire 实现依赖注入机制，对现有DDD架构项目中大量使用全局变量的情况进行控制反转重构，使项目结构更清晰',
    is_current: false,
    type:"实习",
  },
  {
    id: 0,
    company: '腾讯',
    city: '深圳',
    department: '魔方工作室',
    position: '后台开发',
    time: '2022年7月-2022年8月',
    description: '使用 C++ 语言设计并开发了一款对象存储系统，能够在1分钟内处理10w小文件的上传和下载。系统充分利用了 epoll 的 IO 多路复用机制。元信息使用leveldb，网络传输根据不同场景综合使用 TCP 和 UDP 协议，优化数据传输性能',
    is_current: false,
    type:"实习",
  }


]
const education = [
  {
    id: 1,
    school: '东南大学',
    degree: '硕士',
    major: '计算机技术',
    city: "南京",
    college: "计算机科学与工程学院",
    time: '2023年9月-2026年9月',
    course: "算法设计与分析(规格化87)、计算机网络体系结构(规格化87)、软件开发方法与技术(规格化89)",
    reward: "东南大学至善奖学金、学业奖学金一等奖、三好研究生标兵",
    is_current: true,
  },
  {
    id: 0,
    school: '南京航空航天大学',
    degree: '本科',
    major: '计算机科学与技术',
    city: "南京",
    college: "计算机科学与技术学院",
    time: '2019年9月-2023年6  月',
    course: "软件开发方法与技术（92 分）、算法设计与分析（91 分）、计算机网络体系结构、人工智能",
    reward: "CCF 优秀大学生、华为智能基座奖学金、优秀学生奖学金一等奖、三好学生、优秀学生干部",
    is_current: false,
  }
]

const papers = [
  {

    content: 'Jinghui Zhang; Jiawei Wang; <b>Yaning Li</b>; Fa Xin; Fang Dong; Junzhou Luo; Zhihua Wu; Addressing Heterogeneity in Federated Learning with Client Selection via Submodular Optimization, ACM Transactions on Sensor Networks, 2024, Volume 20, Issue 2, Article No.:48, pp 1–32 ',
    level: 'CCF-B',
  }
]

const badge_type = [
  'info',
  'warning',
  'primary',
  'success',
]
const badge_name = [
  '了解',
  '熟悉',
  '掌握',
  '熟练',
]
const skills = [
  {
  name: 'C++',
  icon: cppIcon,
  type: 3,
  },
  {
  name: 'git',
  icon: gitIcon,
  type: 3,
  },
  {
  name: 'Golang',
  icon: golangIcon,
  type: 2,
  },
  {
  name: 'Python',
  icon: pythonIcon,
  type: 2,
  },
  {
  name: 'Vue',
  icon: vueIcon,
  type: 2,
  },
  {
  name: 'Docker',
  icon: DockerIcon,
  type: 2,
  },
  {
  name: 'k8s',
  icon: K8sIcon,
  type: 1,
  },
  {
  name: 'Java',
  icon: javaIcon,
  type: 1,
  },
  {
  name: 'cmake',
  icon: cmakeIcon,
  type: 1,
  },
  {
  name: 'Lua',
  icon: luaIcon,
  type: 0,
  },
]

const contests = [
  {
    name: '全国研究生数学建模竞赛',
    level: '国家二等奖',
  },
   {
    name:'ICPC国际大学生程序设计竞赛亚洲总决赛(EC-Final)',
    level: '铜奖',
  },
  {
    name:'ICPC国际大学生程序设计竞赛亚洲区域赛',
    level: '银奖',
  },
  {
    name: '江苏省大学生程序设计竞赛',
    level: '金奖',
  },
  {
    name:"“蓝桥杯”全国软件和信息技术专业人才大赛全国总决赛",
    level:"二等奖",
  },
  {
    name:"中国研究生数学建模竞赛",
    level:"国家二等奖",
  },
  {
    name:"全国研究生操作系统开源创新大赛",
    level:"三等奖",
  },
  {
    name:"华为Hackthon软件难题挑战赛|软件之星",
    level:"软件之星"
  }

]
</script>

<style scoped>
.home {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

/* 头部区域 */
.hero-section {
  margin-bottom: 40px;
}

.profile-card {
  background: linear-gradient(135deg, var(--el-color-primary-light-3), var(--el-color-primary));
  padding: 40px;
  border-radius: 16px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.3);
}

.profile-header .name {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.profile-header .title {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

/* 内容区域 */
.content-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 32px;
  box-shadow: var(--shadow-light);
  border: 1px solid var(--el-border-color-light);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 24px;
}

.section-title .el-icon {
  font-size: 1.5rem;
  color: var(--el-color-primary);
}

/* 时间线卡片 */
.timeline-card {
  background: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all var(--transition-normal);
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-heavy);
}

.education-header, .work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.education-header h3, .work-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.work-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.timeline-content {
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.timeline-content p {
  margin: 8px 0;
}

/* 竞赛获奖网格 */
.contests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.contest-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all var(--transition-normal);
}

.contest-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-light);
}

.contest-icon {
  font-size: 2rem;
  color: var(--el-color-warning);
}

.contest-content h4 {
  margin: 0 0 4px 0;
  color: var(--el-text-color-primary);
}

.contest-level {
  color: var(--el-text-color-regular);
  font-size: 0.9rem;
}

/* 论文列表 */
.papers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.paper-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

.paper-content {
  flex: 1;
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.paper-level {
  flex-shrink: 0;
}

/* 技能网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  transition: all var(--transition-normal);
}

.skill-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-light);
}

.skill-icon {
  width: 32px;
  height: 32px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  flex-shrink: 0;
}

.skill-content h4 {
  margin: 0 0 4px 0;
  color: var(--el-text-color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home {
    padding: 12px;
    height: 100vh;
    overflow-y: auto;
  }
  
  .profile-card {
    padding: 24px;
  }
  
  .profile-header .name {
    font-size: 2rem;
  }
  
  .section {
    padding: 20px;
  }
  
  .education-header, .work-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .contests-grid, .skills-grid {
    grid-template-columns: 1fr;
  }
}

/* 暗色主题适配 */
[data-theme="dark"] .profile-card {
  background: linear-gradient(135deg, var(--el-color-primary-dark-2), var(--el-color-primary-light-3));
}

[data-theme="dark"] .section {
  background: var(--el-bg-color-page);
  border-color: var(--el-border-color);
}

[data-theme="dark"] .timeline-card,
[data-theme="dark"] .contest-item,
[data-theme="dark"] .paper-item,
[data-theme="dark"] .skill-item {
  background: var(--el-bg-color);
  border-color: var(--el-border-color);
}
</style>
