import { createRouter, createWebHistory } from "vue-router";


let routes = [
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
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@pages/home.vue')
    },
    {
        path: '/login',
        name: 'login',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@pages/login.vue')
    },
    {
        path: '/register',
        name: 'register',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@pages/register.vue')
    },
    {
        path: '/file',
        name: 'file',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@pages/file.vue')
    },
    {
        path: '/generate-code',
        name: 'generate-code',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@pages/generateCode.vue')
    },
    {
        path: '/message-box',
        name: 'message-box',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@pages/messageBox.vue')
    },
    {
        path: '/appreciate',
        name: 'appreciate',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@pages/appreciate.vue')
    },
    {
        path: '/add-reply',
        name: 'add-reply',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('@pages/addReply.vue')
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