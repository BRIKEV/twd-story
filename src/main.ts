import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useTwdSuite } from './composables/useTwdSuite'
import { whenWide } from './composables/useWideScreen'

// The sidebar and its tests load in their own chunk, so the page paints first.
// Narrow screens get a desktop-only notice instead, so they skip it entirely.
whenWide(() => void import('./twd').then(({ startTwd }) => startTwd()))

// Start following runs right away, so a Run All pressed on any chapter counts
useTwdSuite()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
