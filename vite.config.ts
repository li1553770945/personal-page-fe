import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from "path"; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    // ↓路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
      "@pages":resolve(__dirname,"./src/pages"),
      "@components":resolve(__dirname,"./src/components"),
      "@style":resolve(__dirname,"./src/style"),
    }
  }
})
