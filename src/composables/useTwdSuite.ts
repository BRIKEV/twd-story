import { ref } from 'vue'
import { handlers } from 'twd-js/runner'

export interface SuiteSnapshot {
  total: number
  passed: number
  failed: number
  running: boolean
}

export interface CompletedRun {
  /** How many distinct tests ran: equal to the total for a Run All. */
  tests: number
  /** Which ones, so a page can check a run covered its own suite. */
  ids: Set<string>
  duration: number
  passed: number
  failed: number
}

/**
 * Tracked at module level, by one loop that never stops: Run All spends most
 * of its time on other chapters, while the page that cares about it is not
 * even mounted, and still has to count every test it ran.
 */
const run = {
  startedAt: null as number | null,
  idleSince: null as number | null,
  seen: new Set<string>(),
  last: null as CompletedRun | null,
}

/**
 * Between two tests of a Run All nothing is "running" for a moment, so a run
 * only counts as over once the sidebar has been idle this long.
 */
const SETTLE_MS = 600

const read = () => {
  const snapshot: SuiteSnapshot = { total: 0, passed: 0, failed: 0, running: false }
  const runningIds: string[] = []
  for (const handler of handlers.values()) {
    if (handler.type !== 'test') continue
    snapshot.total += 1
    if (handler.status === 'pass') snapshot.passed += 1
    if (handler.status === 'fail') snapshot.failed += 1
    if (handler.status === 'running') {
      snapshot.running = true
      runningIds.push(handler.id)
    }
  }
  return { snapshot, runningIds }
}

/**
 * Follows every test in the sidebar at once, for the chapter that asks the
 * reader to press Run All. A run spans from the first test starting until
 * none has been running for SETTLE_MS. The runner does not reset statuses when
 * Run All starts, so a run is told apart from a single ▶ by counting the tests
 * seen running; every test waits at least 100ms in twd.visit, so none slips
 * between two animation frames.
 */
const suite = ref<SuiteSnapshot>(read().snapshot)
const lastRun = ref<CompletedRun | null>(null)
let started = false

const tick = () => {
  const { snapshot, runningIds } = read()
  const now = performance.now()
  if (snapshot.running) {
    if (run.startedAt === null) {
      run.startedAt = now
      run.seen.clear()
    }
    run.idleSince = null
    runningIds.forEach((id) => run.seen.add(id))
  } else if (run.startedAt !== null) {
    run.idleSince ??= now
    if (now - run.idleSince >= SETTLE_MS) {
      run.last = {
        tests: run.seen.size,
        ids: new Set(run.seen),
        duration: run.idleSince - run.startedAt,
        passed: snapshot.passed,
        failed: snapshot.failed,
      }
      run.startedAt = null
      run.idleSince = null
    }
  }
  // Still inside a run while it settles, so the page doesn't flicker between tests
  snapshot.running ||= run.startedAt !== null
  suite.value = snapshot
  lastRun.value = run.last
  requestAnimationFrame(tick)
}

/**
 * Follows every test in the sidebar at once, for the chapter that asks the
 * reader to press Run All. A run spans from the first test starting until
 * none has been running for SETTLE_MS. The runner does not reset statuses when
 * Run All starts, so a run is told apart from a single ▶ by counting the tests
 * seen running; every test waits at least 100ms in twd.visit, so none slips
 * between two animation frames.
 */
export function useTwdSuite() {
  if (!started) {
    started = true
    requestAnimationFrame(tick)
  }
  return { suite, lastRun }
}

/** Ids of every test inside the top-level describe with this name. */
export function testIdsIn(suiteName: string): string[] {
  const suite = [...handlers.values()].find(
    (handler) => handler.type === 'suite' && !handler.parent && handler.name === suiteName,
  )
  if (!suite) return []
  const ids: string[] = []
  const walk = (id: string) => {
    const handler = handlers.get(id)
    if (!handler) return
    if (handler.type === 'test') ids.push(handler.id)
    handler.children?.forEach(walk)
  }
  suite.children?.forEach(walk)
  return ids
}
