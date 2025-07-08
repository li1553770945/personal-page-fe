import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router, { preloadRouteComponents } from "./routes/index"; 
import { createPinia } from 'pinia' 
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import RoutePreloader from '@/utils/routePreloader';

const pinia = createPinia()

const app= createApp(App)

 //routes 
app.use(router)  
app.use(pinia)
app.mount('#app')

// 应用挂载后，智能启动预加载
setTimeout(() => {
    // 如果当前路由是首页且还未预加载，启动预加载
    if (router.currentRoute.value.name === 'home' && !RoutePreloader.isPreloadComplete()) {
        RoutePreloader.preloadAll(500); // 延迟500ms开始预加载
    }
}, 1000); // 应用挂载1秒后检查