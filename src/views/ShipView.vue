<script setup lang="ts">
import { computed, watch } from 'vue'
import FeatureVideo from '@/components/FeatureVideo.vue'
import TourCard, { type TourStep } from '@/components/TourCard.vue'
import { links } from '@/links'
import { useTwdSuite } from '@/composables/useTwdSuite'
import { useTwdFilter } from '@/composables/useTwdFilter'
import { useSpotlight } from '@/composables/useSpotlight'

const { suite, lastRun } = useTwdSuite()
const { filter } = useTwdFilter()

// A run that touched every test is a Run All; a single ▶ or a filtered run doesn't count
const ranEverything = computed(
  () => !!lastRun.value && suite.value.total > 0 && lastRun.value.tests >= suite.value.total,
)
const allGreen = computed(() => ranEverything.value && lastRun.value!.failed === 0)
const filtered = computed(() => filter.value.trim() !== '')

useSpotlight(() => {
  if (suite.value.running || allGreen.value) return null
  return filtered.value ? '#twd-search-input' : '.twd-sidebar-header-buttons .twd-btn-primary'
})

const steps = computed<TourStep[]>(() => [
  {
    text: 'Clear the <strong>Filter tests</strong> box in the sidebar, so every test shows again.',
    state: filtered.value && !ranEverything.value ? 'active' : 'done',
  },
  {
    text: 'Press <strong>Run All</strong>. The page runs through every chapter and the shop, then comes back here.',
    state: allGreen.value ? 'done' : filtered.value ? 'todo' : 'active',
  },
])

const tone = computed(() => {
  if (suite.value.running) return 'info'
  if (ranEverything.value) return allGreen.value ? 'success' : 'error'
  return undefined
})

const seconds = computed(() => (lastRun.value ? (lastRun.value.duration / 1000).toFixed(1) : ''))

// The tests' clicks scroll the page; bring the result back into view when they finish
watch(lastRun, (run) => {
  if (run && run.tests >= suite.value.total) window.scrollTo({ top: 0, behavior: 'smooth' })
})

const skills = [
  {
    name: '/twd:setup',
    text: 'Detects your framework, installs twd-js and twd-cli, and wires the sidebar into your app.',
  },
  {
    name: 'twd',
    text: 'The agent loop: writes a test, runs it headless, reads the structured failure, fixes and runs it again until it passes.',
  },
  {
    name: '/twd:ci-setup',
    text: 'Generates the GitHub Actions workflow, with coverage, contract checks and PR recordings if you want them.',
  },
  {
    name: '/twd:test-gaps',
    text: 'Compares your routes against your tests and ranks the untested pages by risk.',
  },
  {
    name: '/twd:test-quality',
    text: 'Grades your tests on journeys, interactions, assertions and error handling.',
  },
  {
    name: '/twd:test-flow-gallery',
    text: 'Turns your test files into flowcharts with plain-language summaries.',
  },
]
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <p class="eyebrow">Chapter 6</p>
      <h1>Run it all</h1>
      <p class="lede">
        You've run the tests one chapter at a time. Now all of them in one go: every chapter, the
        shop, and back here.
      </p>
    </header>

    <div class="finale-run">
      <TourCard :steps="steps" :unlocked="allGreen" :tone="tone">
        <template v-if="suite.running">
          {{ suite.passed }} of {{ suite.total }} passed so far…
        </template>
        <template v-else-if="allGreen">
          <strong>{{ suite.total }} tests, {{ seconds }}s, 0 failures.</strong> That's the whole
          tour, start to finish: typed, clicked, slowed down, mocked and checked.
        </template>
        <template v-else-if="ranEverything">
          {{ lastRun!.failed }} failed. Click a red test in the sidebar to see why, then press Run
          All again.
        </template>
      </TourCard>
    </div>

    <h2 class="section-title">The tests you ran are the real ones</h2>
    <p class="section-lede">
      Nothing on this site is a mock-up of TWD. The tests in the sidebar are the ones that guard
      this site's own pull requests, and the receipts are public.
    </p>

    <ul class="proof">
      <li>
        <a :href="links.ciRuns" target="_blank" rel="noopener">
          <strong>CI runs ↗</strong>
          <span
            >Every push runs all of them headless with twd-cli. Coverage is in the job
            summary.</span
          >
        </a>
      </li>
      <li>
        <a :href="links.recordedPrs" target="_blank" rel="noopener">
          <strong>Recorded pull requests ↗</strong>
          <span>PRs labelled <code>record</code> get a video of their new tests.</span>
        </a>
      </li>
      <li>
        <a :href="links.tests" target="_blank" rel="noopener">
          <strong>The test files ↗</strong>
          <span>The same files the sidebar loads. No hidden fixtures.</span>
        </a>
      </li>
    </ul>

    <section class="skills">
      <div class="skills-intro">
        <h2>Write them with Claude Code</h2>
        <p>
          The <code>twd-ai</code> plugin teaches Claude Code how TWD tests are written, run and
          fixed. Install it once:
        </p>
        <pre class="snippet"><code>claude plugin marketplace add BRIKEV/twd-ai
claude plugin install twd@twd-ai</code></pre>
        <FeatureVideo
          src="/videos/twd-agent-loop.mp4"
          poster="/videos/twd-agent-loop-poster.jpg"
          label="Claude Code writes a TWD test, runs it headless, reads the failure and fixes it until it passes."
        />
      </div>
      <ul class="skill-list">
        <li v-for="skill in skills" :key="skill.name">
          <code>{{ skill.name }}</code>
          <p>{{ skill.text }}</p>
        </li>
      </ul>
    </section>

    <section class="finale">
      <h2>Try it in your app</h2>
      <pre class="snippet"><code>npm i -D twd-js
npx twd-js init public</code></pre>
      <p>
        Works with React, Vue, Angular, Solid, Astro, Nuxt, HTMX and vanilla JS, on Vite, Webpack or
        a CDN.
      </p>
      <div class="hero-actions">
        <a class="button primary large" :href="links.docs" target="_blank" rel="noopener">
          Read the docs →
        </a>
        <a class="button large" :href="links.twdRepo" target="_blank" rel="noopener">
          Star on GitHub
        </a>
      </div>
    </section>
  </article>
</template>
