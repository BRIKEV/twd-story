<script setup lang="ts">
import { computed, watch } from 'vue'
import ShopApp from '@/components/shop/ShopApp.vue'
import StageFrame from '@/components/StageFrame.vue'
import TestSource from '@/components/TestSource.vue'
import TourCard, { type TourStep } from '@/components/TourCard.vue'
import { chapterAfter } from '@/chapters'
import { useTwdSuite } from '@/composables/useTwdSuite'
import { useSpotlight } from '@/composables/useSpotlight'
import source from '@/twd-tests/05-shop.twd.test.ts?raw'

const { suite, lastRun } = useTwdSuite()

// A run that touched every test is a Run All; a single ▶ doesn't count here
const ranEverything = computed(
  () => !!lastRun.value && lastRun.value.tests >= suite.value.total && suite.value.total > 0,
)
const allGreen = computed(() => ranEverything.value && lastRun.value!.failed === 0)

useSpotlight(() =>
  suite.value.running || allGreen.value ? null : '.twd-sidebar-header-buttons .twd-btn-primary',
)

const steps = computed<TourStep[]>(() => [
  {
    text: 'Press <strong>Run All</strong> at the top of the sidebar. Off for speed, Slow if you want to follow it.',
    state: suite.value.running || ranEverything.value ? 'done' : 'active',
  },
  {
    text: 'Watch the page jump through every chapter, then the shop gets put through its paces.',
    state: allGreen.value ? 'done' : suite.value.running ? 'active' : 'todo',
  },
])

const tone = computed(() => {
  if (suite.value.running) return 'info'
  if (ranEverything.value) return allGreen.value ? 'success' : 'error'
  return undefined
})

// The tests' clicks scroll the shop into view; bring the result back to the top
watch(lastRun, (run) => {
  if (run && run.tests >= suite.value.total) window.scrollTo({ top: 0, behavior: 'smooth' })
})

const seconds = computed(() => (lastRun.value ? (lastRun.value.duration / 1000).toFixed(1) : ''))
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <p class="eyebrow">Chapter 5</p>
      <h1>Run everything</h1>
      <p class="lede">
        One last app: a small shop with a catalog, a cart, discount codes and a checkout, with every
        request mocked. Its tests cover sold-out stock, declined cards and everything in between.
        Then run the whole tour in one go.
      </p>
    </header>

    <div class="chapter-body">
      <div class="chapter-text">
        <TourCard :steps="steps" :next="chapterAfter('/shop')" :unlocked="allGreen" :tone="tone">
          <template v-if="suite.running">
            {{ suite.passed }} of {{ suite.total }} passed so far…
          </template>
          <template v-else-if="allGreen">
            <strong>{{ suite.total }} tests, {{ seconds }}s, 0 failures.</strong> Every one of them
            drove this page: typed, clicked, mocked a server and checked the result.
          </template>
          <template v-else-if="ranEverything">
            {{ lastRun!.failed }} failed. Click a red test in the sidebar to see why, then press Run
            All again.
          </template>
        </TourCard>
        <TestSource :source="source" file="05-shop.twd.test.ts" />
      </div>

      <StageFrame url="/shop" :busy="suite.running">
        <ShopApp />
      </StageFrame>
    </div>
  </article>
</template>
