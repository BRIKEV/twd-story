<script setup lang="ts">
import { computed } from 'vue'
import HelloList from '@/components/HelloList.vue'
import StageFrame from '@/components/StageFrame.vue'
import TestSource from '@/components/TestSource.vue'
import TourCard, { type TourStep } from '@/components/TourCard.vue'
import { chapterAfter } from '@/chapters'
import { useTwdTest } from '@/composables/useTwdTest'
import { runButton, useSpotlight } from '@/composables/useSpotlight'
import source from '@/twd-tests/01-first-test.twd.test.ts?raw'

const TEST = 'adds "hello" to the list'

const { status, duration } = useTwdTest(TEST)
const passed = computed(() => status.value === 'pass')

useSpotlight(() => (status.value === 'idle' ? runButton(TEST) : null))

const steps = computed<TourStep[]>(() => [
  {
    text: `Find <strong>${TEST}</strong> in the sidebar. It's the one pulsing.`,
    state: status.value === 'idle' ? 'active' : 'done',
  },
  {
    text: 'Press ▶ next to it, then watch the app on the right, not the sidebar.',
    state: passed.value ? 'done' : status.value === 'idle' ? 'todo' : 'active',
  },
])

const tone = computed(() => {
  if (status.value === 'fail') return 'error'
  if (passed.value) return 'success'
  return status.value === 'running' ? 'info' : undefined
})

const seconds = computed(() =>
  duration.value === null ? null : (duration.value / 1000).toFixed(1),
)
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <p class="eyebrow">Chapter 1</p>
      <h1>Your first test</h1>
      <p class="lede">
        On the right is a tiny app: a text field and a list. In the sidebar there's a test for it.
        Run it, and the result shows up here in the app, not in a terminal.
      </p>
    </header>

    <div class="chapter-body">
      <div class="chapter-text">
        <TourCard
          :steps="steps"
          :next="chapterAfter('/first-test')"
          :unlocked="passed"
          :tone="tone"
        >
          <template v-if="status === 'running'"
            >Running… keep your eyes on the text field.</template
          >
          <template v-else-if="passed">
            <strong>Passed{{ seconds ? ` in ${seconds}s` : '' }}.</strong> That was a user typing
            “hello” into a real input, pressing Add and checking the list, all in this tab.
            <br />Blink and you missed it?
          </template>
          <template v-else-if="status === 'fail'">
            That one failed. Click the test name in the sidebar to see its log, then run it again.
          </template>
        </TourCard>
        <TestSource :source="source" file="01-first-test.twd.test.ts" />
      </div>

      <StageFrame url="/first-test" :busy="status === 'running'">
        <HelloList />
      </StageFrame>
    </div>
  </article>
</template>
