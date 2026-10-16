<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TodoApi from '@/components/TodoApi.vue'
import StageFrame from '@/components/StageFrame.vue'
import TestSource from '@/components/TestSource.vue'
import TourCard, { type TourStep } from '@/components/TourCard.vue'
import { chapterAfter } from '@/chapters'
import { useTwdTest } from '@/composables/useTwdTest'
import { runButton, useSpotlight } from '@/composables/useSpotlight'
import source from '@/twd-tests/04-mocking.twd.test.ts?raw'

/** Each test, and what the chapter says once the reader has seen it pass. */
const scenarios = [
  {
    test: 'shows the todos the API returns',
    label: 'a list',
    lesson:
      'That list came from <code>twd.mockRequest</code>. The service worker answered <code>/api/todos</code> before the request left your browser.',
  },
  {
    test: 'shows an empty state when there are no todos',
    label: 'an empty state',
    lesson: 'An empty state, and nobody had to clear out a database for it.',
  },
  {
    test: 'shows an error when the server fails',
    label: 'a server error',
    lesson: 'A 500 whenever you want one. Nobody had to break a server.',
  },
  {
    test: 'recovers when the server comes back',
    label: 'a recovery',
    lesson:
      'It fails, then it works: the second mock reuses the alias and replaces the first, all in one test.',
  },
  {
    test: 'shows a loading state while the API is slow',
    label: 'a slow API',
    lesson: 'A 1.5s <code>delay</code> keeps the loading state on screen long enough to check it.',
  },
  {
    test: 'sends a new todo to the API',
    label: 'a POST',
    lesson:
      'The test also checked what the app sent: <code>{ title: "Ship it" }</code>, read back with <code>twd.waitForRequest</code>.',
  },
]

const UNLOCK_AFTER = 3

const tracked = scenarios.map((scenario) => ({ ...scenario, ...useTwdTest(scenario.test) }))

const lastPassed = ref<(typeof scenarios)[number] | null>(null)
for (const scenario of tracked) {
  watch(scenario.status, (next, previous) => {
    if (next === 'pass' && previous !== 'pass') lastPassed.value = scenario
  })
}

const passedCount = computed(() => tracked.filter((s) => s.status.value === 'pass').length)
const running = computed(() => tracked.some((s) => s.status.value === 'running'))
const failed = computed(() => tracked.find((s) => s.status.value === 'fail'))
const firstUnseen = computed(() => tracked.find((s) => s.status.value !== 'pass'))

useSpotlight(() => (running.value || !firstUnseen.value ? null : runButton(firstUnseen.value.test)))

const steps = computed<TourStep[]>(() =>
  tracked.map((scenario) => ({
    text: `<strong>${scenario.label}</strong>: ${scenario.test}`,
    state:
      scenario.status.value === 'pass'
        ? 'done'
        : scenario === firstUnseen.value
          ? 'active'
          : 'todo',
  })),
)

const tone = computed(() => {
  if (failed.value && !running.value) return 'error'
  if (running.value) return 'info'
  return lastPassed.value ? 'success' : undefined
})
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <p class="eyebrow">Chapter 4</p>
      <h1>No backend? Mock it.</h1>
      <p class="lede">
        This todo app talks to <code>/api/todos</code>, and as the app itself is telling you, there
        is no server behind this site. In TWD the test decides what the API answers: a list,
        nothing, a 500, a slow response. Run the tests in this chapter, in any order.
      </p>
    </header>

    <div class="chapter-body">
      <div class="chapter-text">
        <TourCard
          :steps="steps"
          :next="chapterAfter('/mocking')"
          :unlocked="passedCount >= UNLOCK_AFTER"
          :tone="tone"
        >
          <template v-if="running">Watch the app on the right…</template>
          <template v-else-if="failed">
            <strong>{{ failed.test }}</strong> failed. Click it in the sidebar to see the log.
          </template>
          <template v-else-if="lastPassed">
            <span v-html="lastPassed.lesson" />
            <template v-if="passedCount < UNLOCK_AFTER">
              <br />Try another one: {{ UNLOCK_AFTER - passedCount }} more and the next chapter
              opens.
            </template>
            <template v-else>
              <br />Now reload the page. The mocks are gone, and so is the backend.
            </template>
          </template>
        </TourCard>
        <TestSource :source="source" file="04-mocking.twd.test.ts" />
      </div>

      <StageFrame url="/mocking" :busy="running">
        <TodoApi />
      </StageFrame>
    </div>
  </article>
</template>
