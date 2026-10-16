/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, unknown>
  export default component
}

interface Window {
  /** Set by the TWD sidebar's Speed selector (twd-js src/pace.ts). */
  __TWD_PACE__?: { paceMs: number; keyDelayMs: number; generation: number }
}
