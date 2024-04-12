import { createRouter, createWebHistory } from "vue-router";


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
        path: '/message-box',
        name: 'message-box',

        component: () => import('@pages/messageBox.vue')
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
export default router 