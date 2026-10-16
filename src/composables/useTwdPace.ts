import { onMounted, onUnmounted, ref } from 'vue'

/** The speed picked in the sidebar's Speed selector, in ms per command. */
export function useTwdPace() {
  const paceMs = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined

  const read = () => {
    paceMs.value = window.__TWD_PACE__?.paceMs ?? 0
  }

  onMounted(() => {
    read()
    timer = setInterval(read, 200)
  })
  onUnmounted(() => clearInterval(timer))

  return { paceMs }
}
