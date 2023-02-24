import { createRouter, createWebHistory } from "vue-router";
 
 
let routes= [
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