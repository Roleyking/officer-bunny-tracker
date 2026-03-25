import { createApp } from 'vue'
import App from './App.vue'
import './styles/app.css'
import './overrides.css'

createApp(App).mount('#app')

const registerPWA = async () => {
  const { registerSW } = await import('virtual:pwa-register')
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('发现新版本，是否立即更新？')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('PWA 已可离线使用')
    }
  })
}

if ('serviceWorker' in navigator) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => registerPWA())
  } else {
    setTimeout(() => registerPWA(), 1500)
  }
}
