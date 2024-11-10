import { createRouter, createWebHistory } from "vue-router";
import { ElLoading } from 'element-plus';

let routes = [
     //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
    {
        // /search/screens -> /search?q=screens
        path: '/',
        redirect: () => {
            // 方法接收目标路由作为参数
            // return 重定向的字符串路径/路径对象
            return { path: '/home' }
        },
    },
    {
        path: '/home',
        name: 'home',

        component: () => import('@pages/home.vue')
    },
    {
        path: '/login',
        name: 'login',

        component: () => import('@pages/login.vue')
    },
    {
        path: '/register',
        name: 'register',

        component: () => import('@pages/register.vue')
    },
    {
        path: '/file',
        name: 'file',

        component: () => import('@pages/file.vue')
    },
    {
        path: '/generate-code',
        name: 'generate-code',

        component: () => import('@pages/generateCode.vue')
    },
    {
        path: '/feedback',
        name: 'feedback',

        component: () => import('@pages/feedback.vue')
    },
    {
        path: '/appreciate',
        name: 'appreciate',

        component: () => import('@pages/appreciate.vue')
    },
    {
        path: '/unread-msg',
        name: 'unread-msg',

        component: () => import('@pages/unreadMsg.vue')
    },
    {
        path: '/read-msg/:uuid',
        name: 'read-msg',
        component: () => import('@pages/readMsg.vue')
    },
    {
        path: '/projects',
        name: 'projects',
        component: () => import('@pages/projects.vue')
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@pages/chat.vue')
    },
    //{
    //配置404页面
    //path: '/:catchAll(.*)',
    //name: '404',
    //component: () => import(''),
    //}
]
// 路由
const router = createRouter({
    history: createWebHistory(),
    routes
})
// 导出



let loadingInstance:any = null;
let showTimer:any = null;
let startTime:any = null;

const showDelay = 200; // 延迟显示加载动画的时间（0.2秒）
const minimumDisplayTime = 300; // 加载动画的最小显示时间（0.3秒）



router.beforeEach((to, from, next) => {
    clearTimeout(showTimer);
    startTime = null;

    // 延迟显示加载动画
    showTimer = setTimeout(() => {
        loadingInstance = ElLoading.service({
            lock: true,
            text: 'Loading...',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        startTime = Date.now(); // 记录开始显示加载动画的时间
    }, showDelay);

    next();
});

router.afterEach(() => {
    clearTimeout(showTimer);

    if (loadingInstance) {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minimumDisplayTime) {
            // 如果显示时间不足最小显示时间，则延迟关闭
            setTimeout(() => {
                loadingInstance.close();
            }, minimumDisplayTime - elapsedTime);
        } else {
            // 如果已经超过最小显示时间，立即关闭
            loadingInstance.close();
        }
    }
});

export default router;
