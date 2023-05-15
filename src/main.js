import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 创建vue实例
const app = createApp(App)

// 将router和pinia添加进vue实例中
app.use(router)
app.use(pinia)
// 全局注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
