import { defineStore } from 'pinia'
// useMain  可以是 useUser、useCart 之类的名字 
// defineStore('main',{..}) 在devtools 就使用 main 这个名
export const useUser = defineStore('user', {
    // 相当于data
    state: () => {
        return {
         username:"",
         nickname:"",
        }
    },
    // 相当于计算属性
    getters: {
        doubleCount: (state) => {
            
        },
    },
    // 相当于vuex的 mutation + action，可以同时写同步和异步的代码
    actions: {
        
    },
})