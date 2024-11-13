<template>
  <div class="home">
    <div class="resume">
      <el-container class="info">
        <!-- <el-aside width="200px">Aside</el-aside> -->
        <el-main>
          <el-row class="name">
            <h2>李亚宁</h2>
          </el-row>
          <!-- <el-row class="education-info">
            东南大学 硕士 电子信息
          </el-row> -->
        </el-main>
      </el-container>
      <el-container class="education">
        <el-main class="main">
          <el-row class="item-name">
            <h3>教育经历</h3>
          </el-row>
          <el-timeline>
            <el-timeline-item v-for="item in education" :key="item.id" :timestamp="item.time" placement="top"
              :color="item.is_current ? '#409EFF' : '#0bbd87'">
              <el-card>
                <div class="education-header">
                  <b>{{ item.school }} {{ item.college }} {{ item.major }} </b>
                </div>
                <div class="work-experience-body">
                  <b>主修课程: </b>{{ item.course }}
                  <br>
                  <b>荣誉奖项: </b>{{ item.reward }}
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-main>
      </el-container>
      <el-container class="work">
        <el-main class="main">
          <el-row class="item-name">
            <h3>工作/实习经历</h3>
          </el-row>
          <el-timeline>
            <el-timeline-item v-for="item in work" :key="item.company" :timestamp="item.time" placement="top"
              :color="item.is_current ? '#409EFF' : '#0bbd87'">
              <el-card>
                <div class="work-experience-header">
                  <span class="position"><b>{{ item.company }} {{ item.department }} {{ item.position }} </b></span>
                </div>
                <div class="work-experience-body">
                  <div>{{ item.description }}</div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-main>
      </el-container>
      <el-container class="contests">
        <el-main>
          <el-row class="item-name">
            <h3>竞赛获奖</h3>
          </el-row>
          <div class="paper-content">
              <ul>
                <li v-for="item in contests" class="contests-li">
                    {{ item.name }} - {{ item.level }}
                </li>
              </ul>
            </div>
        </el-main>
      </el-container>
      <el-container class="papers">
        <el-main>
          <el-row class="item-name">
            <h3>论文发表</h3>
          </el-row>
          <div class="paper-content">
              <ul>
                <li v-for="item in papers" class="paper-li">
                  <span class="paper-content" v-html="item.content"></span>
                  <span class="paper-level">({{ item.level }})</span>
                </li>
              </ul>
            </div>
        </el-main>
      </el-container>
      <el-container class="skill">
        <el-main>
          <el-row class="item-name">
            <h3>技能</h3>
          </el-row>
          <div v-for="item in skills" class="skill-item">
            <div class="skill-content"><span class="skill-icon"
                :style="{ backgroundImage: 'url(' + item.icon + ')' }" />
              <el-badge :value="badge_name[item.type]" :type="badge_type[item.type]" :offset="[5, -5]">
                {{ item.name }}
              </el-badge>
            </div>

          </div>
        </el-main>
      </el-container>

    </div>
  </div>
</template>

<script setup lang="ts">

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

const work = [
  {
    id: 0,
    company: '字节跳动',
    city: '南京',
    department: 'Data部门',
    position: '后端开发',
    time: '2022年11月-2023年2月',
    description: '为字节跳动商业化数据平台后端开发 RPC 服务，将现有项目的 RPC 依赖管理方式从本地改为使用 overpass；对现有项目进行控制反转重构',
    is_current: false,
  },
  {
    id: 0,
    company: '腾讯',
    city: '深圳',
    department: '魔方工作室',
    position: '后台开发',
    time: '2022年7月-2022年8月',
    description: '使用 C++语言，设计开发一款对象存储系统。项目使用分布式架构，支持多租户隔离，支持百万级文件存储，利用 epoll 的 IO 多路复用机制，综合使用 TCP 和 UDP 协议，具有高性能、高可用等特点',
    is_current: false,
  }
]
const education = [
  {
    id: 1,
    school: '东南大学',
    degree: '硕士',
    major: '电子信息',
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
    name:'ICPC国际大学生程序设计竞赛亚洲区域赛',
    level: '银奖',
  },
  {
    name: '江苏省大学生程序设计竞赛',
    level: '金奖',
  }
]
</script>

<style scoped>
.home {
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: center
}

.resume {
  flex: 0 0 800px;
  max-width: 800px;
  min-width: 800px;
}

.subtile {
  font-size: 20px;
  color: aqua;
}

.work-experience {
  border-top: 1px solid #eee;
  padding: 10px 0;
}

.work-experience-header {
  display: flex;
  justify-content: left;
  padding-bottom: 5px;
}

.work-experience-body {
  padding-top: 5px;
}

.spacer {
  flex-grow: 1;
}

.department {
  margin-left: 2em;
}

.city {
  margin-right: 2em;
}


.main {
  padding-top: 0;
  padding-bottom: 0;
}

/* .resume {
  border: 2px solid #000000;
} */

.divider {
  margin: 0;
}

.item {
  margin: 0;
}



.paper-level {
  color: red;
}



.skill-item {
  display: inline-block;
  vertical-align: middle;
  margin-right: 1em;
}

.skill-content {
  border: 1.5px solid var(--el-border-color);
  border-radius: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  display: inline-block;
  margin: 5px;
  font-size: 1.2em;
}

.skill-icon {
  display: inline-block;
  width: 1.3em;
  height: 1.3em;
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: middle;
  margin-right: 5px;
}
</style>
