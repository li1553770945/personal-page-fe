import { defineConfig,type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from 'vite-plugin-compression';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // 加载对应模式的环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 根据环境变量判断是否需要代理
  const needProxy = env.VITE_API_BASE_URL === '/api'
  
  // 根据模式确定代理目标
  const getProxyTarget = () => {
    if (mode === 'development') {
      return {
        api: 'http://localhost:9100/',
        socket: 'ws://localhost:9100/'
      }
    } else if (mode === 'development.prod') {
      return {
        api: 'https://api.peacesheep.xyz/',
        socket: 'wss://socket.peacesheep.xyz/'
      }
    }
    return {
      api: 'http://localhost:9100/',
      socket: 'ws://localhost:9100/'
    }
  }
  
  const proxyTarget = getProxyTarget()
  
  return {
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
    proxy: needProxy ? {
      '/api': { // 匹配请求路径，
        target: proxyTarget.api, // 代理的目标地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // 保持 /api 路径
      },
      '/socket': { // 匹配请求路径，
        ws: true,
        target: proxyTarget.socket, // 代理的目标地址
        changeOrigin: true,
      }
    } : {}
  }

  }
})
