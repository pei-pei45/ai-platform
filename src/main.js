import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import '../src/assets/style.css'
// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(ElementPlus)
app.use(createPinia())

// 挂载应用
app.mount('#app')
