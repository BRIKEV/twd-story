import { onMounted, onUnmounted, ref } from 'vue'
import { handlers } from 'twd-js/runner'

export type TestStatus = 'idle' | 'running' | 'pass' | 'fail' | 'skip'

interface RunRecord {
  startedAt: number | null
  /** Wall-clock time of the last pass, as seen from the page. */
  duration: number | null
  /** The sidebar speed the last run started with. */
  paceMs: number
}

/**
 * Kept outside the component on purpose: twd.visit() remounts the page mid-run
 * (it passes through a throwaway route), so per-component state would lose
 * the start of the run it is meant to time.
 */
const records = new Map<string, RunRecord>()

const readStatus = (name: string): TestStatus => {
  for (const handler of handlers.values()) {
    if (handler.type === 'test' && handler.name === name) return handler.status ?? 'idle'
  }
  return 'idle'
}

/**
 * Follows a test in the sidebar by name, so a chapter can react when the reader
 * presses ▶.
 *
 * twd-js keeps its runner state on `window.__TWD_STATE__`, shared by the
 * sidebar and this import, but announces no events. Polling on animation
 * frames is cheap and fine-grained enough to catch a test that runs in 200ms.
 */
export function useTwdTest(name: string) {
  if (!records.has(name)) records.set(name, { startedAt: null, duration: null, paceMs: 0 })
  const record = records.get(name)!

  const status = ref<TestStatus>(readStatus(name))
  const duration = ref(record.duration)
  const paceMs = ref(record.paceMs)

  let frame = 0

  const tick = () => {
    const next = readStatus(name)
    if (next === 'running' && record.startedAt === null) {
      record.startedAt = performance.now()
      record.paceMs = window.__TWD_PACE__?.paceMs ?? 0
    }
    if (next !== 'running' && record.startedAt !== null) {
      record.duration = next === 'pass' ? performance.now() - record.startedAt : null
      record.startedAt = null
    }
    status.value = next
    duration.value = record.duration
    paceMs.value = record.paceMs
    frame = requestAnimationFrame(tick)
  }

  onMounted(() => {
    frame = requestAnimationFrame(tick)
  })
  onUnmounted(() => cancelAnimationFrame(frame))

  return { status, duration, paceMs }
}
