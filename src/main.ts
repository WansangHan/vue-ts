import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { store, key } from './store/modules/indexedDB'

async function initApp() {
    await store.dispatch('initDB')
    createApp(App).use(store, key).use(router).mount('#app')
}

initApp()