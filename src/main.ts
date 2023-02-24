import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./routes/index"; 
import { createPinia } from 'pinia' 
const pinia = createPinia()

const app= createApp(App)

 //routes 
app.use(router)  
app.use(pinia)
app.mount('#app')