import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { store, key } from './store/modules/indexedDB'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

async function initApp() {
    await store.dispatch('initDB')
    createApp(App).use(store, key).use(router).use(ElementPlus).mount('#app')
}

initApp()