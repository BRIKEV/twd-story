<script setup lang="ts">
import { computed } from 'vue'
import TodoBoard from '@/components/TodoBoard.vue'
import StageFrame from '@/components/StageFrame.vue'
import TestSource from '@/components/TestSource.vue'
import TourCard, { type TourStep } from '@/components/TourCard.vue'
import { chapterAfter } from '@/chapters'
import { useTwdTest } from '@/composables/useTwdTest'
import { useTwdPace } from '@/composables/useTwdPace'
import { runButton, useSpotlight } from '@/composables/useSpotlight'
import source from '@/twd-tests/02-speed.twd.test.ts?raw'

const TEST = 'adds three todos, completes one, deletes one'

// ranAtPace is the speed the last run started with, which may differ from the current pick
const { status, paceMs: ranAtPace } = useTwdTest(TEST)
const { paceMs } = useTwdPace()
const passed = computed(() => status.value === 'pass')

const slowed = computed(() => paceMs.value > 0)
const watchedSlowly = computed(() => passed.value && !!ranAtPace.value)

const tone = computed(() => {
  if (status.value === 'fail') return 'error'
  if (watchedSlowly.value) return 'success'
  return status.value === 'idle' ? undefined : 'info'
})

useSpotlight(() => {
  if (!slowed.value && !watchedSlowly.value) return '#twd-pace-select'
  if (status.value === 'idle' || (passed.value && !ranAtPace.value)) return runButton(TEST)
  return null
})

const steps = computed<TourStep[]>(() => [
  {
    text: 'At the top of the sidebar, set <strong>Speed</strong> to <strong>Slow (300ms)</strong>.',
    state: slowed.value || watchedSlowly.value ? 'done' : 'active',
  },
  {
    text: `Press ▶ next to <strong>${TEST}</strong>.`,
    state: watchedSlowly.value ? 'done' : slowed.value ? 'active' : 'todo',
  },
])
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <p class="eyebrow">Chapter 2</p>
      <h1>Too fast?</h1>
      <p class="lede">
        Tests are fast and people aren't. The sidebar can pause after every command so you can
        follow along. The test file stays the same and CI still runs it at full speed, because the
        speed is a setting of the sidebar, not of the test.
      </p>
    </header>

    <div class="chapter-body">
      <div class="chapter-text">
        <TourCard :steps="steps" :next="chapterAfter('/speed')" :unlocked="passed" :tone="tone">
          <template v-if="status === 'running'">
            {{
              ranAtPace
                ? 'Follow along: three todos typed, one ticked, one deleted.'
                : 'Running at full speed…'
            }}
          </template>
          <template v-else-if="watchedSlowly">
            <strong>Every keystroke, at a pace you can read.</strong> When a test breaks, this is
            how you see where: same test, slowed down, in your own browser. <br />Slow is for
            humans, though. Next: the same tests at full speed, on every pull request.
          </template>
          <template v-else-if="passed">
            Passed, but at full speed again. Set <strong>Speed</strong> to
            <strong>Slow (300ms)</strong> and run it once more.
          </template>
          <template v-else-if="status === 'fail'">
            That one failed. Click the test name in the sidebar to see its log, then run it again.
          </template>
        </TourCard>
        <TestSource :source="source" file="02-speed.twd.test.ts" />
      </div>

      <StageFrame url="/speed" :busy="status === 'running'">
        <TodoBoard />
      </StageFrame>
    </div>
  </article>
</template>
