import { defineStore } from 'pinia'
// useMain  可以是 useUser、useCart 之类的名字 
// defineStore('main',{..}) 在devtools 就使用 main 这个名
export const useFeedback = defineStore('feedback', {
    // 相当于data
    state: () => {
        return {
            category:"",
            content:"",
            name:"",
            contact:"",
        }
    },

})