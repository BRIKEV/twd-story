import { onMounted, onUnmounted, ref } from 'vue'

/** What the reader has typed in the sidebar's "Filter tests" box. */
export function useTwdFilter() {
  const filter = ref('')
  let timer: ReturnType<typeof setInterval> | undefined

  const read = () => {
    const input = document.querySelector<HTMLInputElement>('#twd-search-input')
    filter.value = input?.value ?? ''
  }

  onMounted(() => {
    read()
    timer = setInterval(read, 200)
  })
  onUnmounted(() => clearInterval(timer))

  return { filter }
}
