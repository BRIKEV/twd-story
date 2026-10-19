<script setup lang="ts">
import { computed } from 'vue'
import TestSource from '@/components/TestSource.vue'
import TerminalReplay from '@/components/TerminalReplay.vue'
import FeatureVideo from '@/components/FeatureVideo.vue'
import TourCard, { type TourStep } from '@/components/TourCard.vue'
import { chapterAfter } from '@/chapters'
import { links } from '@/links'
import { useTwdTest } from '@/composables/useTwdTest'
import { useTwdPace } from '@/composables/useTwdPace'
import { runButton, useSpotlight } from '@/composables/useSpotlight'
import source from '@/twd-tests/03-automate.twd.test.ts?raw'

const TEST = 'replays chapters 1 and 2 at full speed'

const { status, duration, paceMs: ranAtPace } = useTwdTest(TEST)
const { paceMs } = useTwdPace()
const passed = computed(() => status.value === 'pass')
const fullSpeed = computed(() => paceMs.value === 0)

useSpotlight(() => {
  if (!fullSpeed.value && !passed.value) return '#twd-pace-select'
  return status.value === 'idle' ? runButton(TEST) : null
})

const steps = computed<TourStep[]>(() => [
  {
    text: 'Set <strong>Speed</strong> back to <strong>Off (full speed)</strong>.',
    state: fullSpeed.value || passed.value ? 'done' : 'active',
  },
  {
    text: `Press ▶ next to <strong>${TEST}</strong>. The page will jump through both chapters and come back here.`,
    state: passed.value ? 'done' : fullSpeed.value ? 'active' : 'todo',
  },
])

const tone = computed(() => {
  if (status.value === 'fail') return 'error'
  if (passed.value) return 'success'
  return status.value === 'idle' ? undefined : 'info'
})

const seconds = computed(() =>
  duration.value === null ? null : (duration.value / 1000).toFixed(1),
)

// Real output of `pnpm test:ci` against this site, trimmed to the summary
const ciOutput = [
  'Navigating to http://localhost:5173 ...',
  'Running 23 test(s)...',
  'Code coverage data written to .nyc_output/out.json',
  '',
  '--- Run complete ---',
  '  Passed: 23 | Failed: 0 | Skipped: 0',
  '  Duration: 6.3s',
  '',
  '  Report: .twd/report/index.html',
]
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <p class="eyebrow">Chapter 3</p>
      <h1>Slow is for humans</h1>
      <p class="lede">
        Watching a test is how you trust it. Running it on every change is how you keep that trust.
        The same files run in a headless browser at full speed, with nobody watching.
      </p>
    </header>

    <div class="chapter-body">
      <div class="chapter-text">
        <TourCard :steps="steps" :next="chapterAfter('/automate')" :unlocked="passed" :tone="tone">
          <template v-if="status === 'running'">Hold on, it's leaving this page…</template>
          <template v-else-if="passed && ranAtPace">
            Back again, at {{ ranAtPace }}ms a step. Set <strong>Speed</strong> to
            <strong>Off</strong> and run it once more to see CI speed.
          </template>
          <template v-else-if="passed">
            <strong>Two chapters{{ seconds ? ` in ${seconds}s` : '' }}, and back.</strong> That's
            what CI sees: every test on every push, with no one watching.
          </template>
          <template v-else-if="status === 'fail'">
            That one failed. Click the test name in the sidebar to see its log, then run it again.
          </template>
        </TourCard>
        <TestSource :source="source" file="03-automate.twd.test.ts" />
      </div>

      <TerminalReplay command="pnpm test:ci" :lines="ciOutput" :play="passed" />
    </div>

    <section class="features">
      <div class="feature">
        <div>
          <h2>Headless, on every pull request</h2>
          <p>
            <code>twd-cli</code> opens the app in headless Chrome and runs the same
            <code>.twd.test.ts</code> files you've been clicking. This site's GitHub workflow runs
            all of them on every push and collects code coverage while it's at it.
          </p>
          <a :href="links.docsCi" target="_blank" rel="noopener">CI execution docs ↗</a>
        </div>
      </div>
      <div class="feature">
        <FeatureVideo
          src="/videos/twd-concept-record.mp4"
          poster="/videos/twd-concept-record-poster.jpg"
          label="twd-cli run --record records a paced headless run and the video is attached to a pull request."
        />
        <div>
          <h2>Recorded for the reviewer</h2>
          <p>
            <code>twd-cli run --record</code> runs paced, like the Slow run in chapter 2, and saves
            one clip per test. Label a pull request on this repo <code>record</code> and CI comments
            with the video, so reviewers watch the change before they read it.
          </p>
          <a :href="links.docsRecording" target="_blank" rel="noopener">Recording docs ↗</a>
        </div>
      </div>
      <div class="feature">
        <div>
          <h2>Run by your agent</h2>
          <p>
            Connect the sidebar to <code>twd-relay</code>, a small WebSocket server, and an AI agent
            or any script can run these tests in the browser you already have open, then read back
            structured results: <code>npx twd-relay run</code>.
          </p>
          <a :href="links.docsRelay" target="_blank" rel="noopener">twd-relay docs ↗</a>
        </div>
      </div>
    </section>
  </article>
</template>
