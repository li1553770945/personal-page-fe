/// <reference types="vite/client" />

// 声明 SVG 模块类型
declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.svg?component" {
  import { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}

declare module "*.svg?url" {
  const src: string;
  export default src;
}
