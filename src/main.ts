import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initTWD } from 'twd-js/bundled'

import App from './App.vue'
import router from './router'
import { useTwdSuite } from './composables/useTwdSuite'

// A normal app guards this with `import.meta.env.DEV`. This site ships the
// sidebar and its tests to production on purpose: the sidebar is the demo.
initTWD(import.meta.glob('./twd-tests/**/*.twd.test.ts'), {
  // Too cramped to drive tests on a phone; the reader can still open it.
  open: window.matchMedia('(min-width: 1024px)').matches,
  position: 'left',
  pace: true,
  // Chapter 5 has the reader filter the sidebar down to the shop's tests
  search: true,
})

// Start following runs right away, so a Run All pressed on any chapter counts
useTwdSuite()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
