import { defineConfig,type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "rollup-visualize.html", //分析图生成的文件名
      open: true //如果存在本地服务端口，将在打包后自动展示
    }) as unknown as PluginOption,
    viteCompression({
      algorithm	: 'brotliCompress',
      threshold: 1024,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  base: "./", // 设置打包路径
  resolve: {
    // ↓路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
      "@pages": resolve(__dirname, "./src/pages"),
      "@components": resolve(__dirname, "./src/components"),
      "@style": resolve(__dirname, "./src/style"),
    }
  },

  server: {
    proxy: {
      '/api': { // 匹配请求路径，
        target: 'http://localhost:9100/', // 代理的目标地址
        changeOrigin: true,
      },
      '/socket': { // 匹配请求路径，
        ws: true,
        target: 'ws://localhost:9100/', // 代理的目标地址
        changeOrigin: true,
      }
    }
  }

})
