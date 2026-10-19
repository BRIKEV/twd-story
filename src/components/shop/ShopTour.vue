<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { chapterAfter } from '@/chapters'
import { useTwdTest } from '@/composables/useTwdTest'
import { useTwdFilter } from '@/composables/useTwdFilter'
import { useShopRun } from '@/composables/useShopRun'
import { runButton, useSpotlight } from '@/composables/useSpotlight'

const FIRST_TEST = 'lists every product with its price'

const { status: firstStatus } = useTwdTest(FIRST_TEST)
const { filter } = useTwdFilter()
const { suite, shopIds, shopRun } = useShopRun()

const next = chapterAfter('/real-app')!
const collapsed = ref(false)

const firstDone = computed(() => firstStatus.value === 'pass' || !!shopRun.value)
const filtered = computed(() => filter.value.trim().toLowerCase().includes('shop'))
const allGreen = computed(() => !!shopRun.value && shopRun.value.failed === 0)
const step = computed(() => {
  if (allGreen.value) return 4
  if (!firstDone.value) return 1
  return filtered.value ? 3 : 2
})

useSpotlight(() => {
  if (suite.value.running || collapsed.value) return null
  if (step.value === 1) return runButton(FIRST_TEST)
  if (step.value === 2) return '#twd-search-input'
  if (step.value === 3) return '.twd-sidebar-header-buttons .twd-btn-primary'
  return null
})

const state = (n: number) => (step.value > n ? 'done' : step.value === n ? 'active' : 'todo')

// The tests' clicks scroll the page; bring the shop back to the top when they finish
watch(shopRun, (run) => {
  if (run) window.scrollTo({ top: 0, behavior: 'smooth' })
})

const seconds = computed(() => (shopRun.value ? (shopRun.value.duration / 1000).toFixed(1) : ''))
</script>

<template>
  <aside class="shop-tour" :class="{ 'is-collapsed': collapsed }" aria-label="TWD tour">
    <header class="shop-tour-head">
      <span>TWD tour · Chapter 5</span>
      <button
        type="button"
        class="icon-button"
        :aria-label="collapsed ? 'Expand the tour' : 'Collapse the tour'"
        @click="collapsed = !collapsed"
      >
        {{ collapsed ? '▴' : '▾' }}
      </button>
    </header>

    <template v-if="!collapsed">
      <ol class="tour-steps">
        <li :class="`is-${state(1)}`">
          <span class="tour-mark" aria-hidden="true">{{ state(1) === 'done' ? '✓' : '' }}</span>
          <span>
            This shop has no backend either. Press ▶ on <strong>{{ FIRST_TEST }}</strong> in the
            sidebar.
          </span>
        </li>
        <li :class="`is-${state(2)}`">
          <span class="tour-mark" aria-hidden="true">{{ state(2) === 'done' ? '✓' : '' }}</span>
          <span>
            Type <strong>shop</strong> in the sidebar's <strong>Filter tests</strong> box. Run All
            turns into Run Filtered.
          </span>
        </li>
        <li :class="`is-${state(3)}`">
          <span class="tour-mark" aria-hidden="true">{{ state(3) === 'done' ? '✓' : '' }}</span>
          <span>
            Press <strong>Run Filtered</strong>: all {{ shopIds.length || 13 }} shop tests, right
            here.
          </span>
        </li>
      </ol>

      <div class="tour-live" aria-live="polite">
        <p v-if="suite.running" class="tour-message is-info">Watch the shop…</p>
        <p v-else-if="allGreen" class="tour-message is-success">
          <strong
            >{{ shopIds.length }} tests in {{ seconds }}s, and you never left the shop.</strong
          >
          Catalog, cart, discounts and checkout, failures included.
        </p>
        <p v-else-if="shopRun" class="tour-message is-error">
          {{ shopRun.failed }} failed. Click a red test in the sidebar to see why.
        </p>
        <p v-else-if="step === 2" class="tour-message is-success">
          That catalog came from a mock. Now let's run every test the shop has.
        </p>
      </div>

      <footer class="shop-tour-foot">
        <RouterLink to="/real-app" class="skip-link">← Back to the tour</RouterLink>
        <RouterLink v-if="allGreen" :to="next.path" class="button primary small">
          Chapter {{ next.number }}: {{ next.title }} →
        </RouterLink>
      </footer>
    </template>
  </aside>
</template>
