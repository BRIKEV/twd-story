<script setup lang="ts">
import FeatureVideo from '@/components/FeatureVideo.vue'
import { links } from '@/links'

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
      <h1>The tests you ran are the real ones</h1>
      <p class="lede">
        Nothing on this site is a mock-up of TWD. The tests in the sidebar are the ones that guard
        this site's own pull requests, and the receipts are public.
      </p>
    </header>

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
