<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="hero">
    <p class="eyebrow">Test While Developing</p>
    <h1>Your tests run<br />in this tab.</h1>
    <p class="lede">
      The panel on the left isn't a screenshot. It's <strong>TWD</strong>, an in-browser test
      runner, loaded into this site with real tests for this site. Press ▶ and a test drives the
      page you're reading. It works in any browser you open.
    </p>
    <div class="hero-actions">
      <RouterLink to="/first-test" class="button primary large">Start the tour →</RouterLink>
      <code class="install">npm i -D twd-js</code>
    </div>
    <p class="dev-only-note">
      In your own app the sidebar only exists while you develop: nothing of TWD ships in your
      production build. This site is the exception, on purpose, because here the sidebar is the
      demo.
    </p>

    <ul class="facts">
      <li>
        <h2>Any browser</h2>
        <p>
          The runner lives in your page, not in a driver. Chrome, Firefox, Safari, whatever's open.
        </p>
      </li>
      <li>
        <h2>Watchable</h2>
        <p>Slow a run down and follow every click and keystroke as it happens.</p>
      </li>
      <li>
        <h2>No backend needed</h2>
        <p>A service worker answers your API calls from inside the page.</p>
      </li>
      <li>
        <h2>Headless in CI</h2>
        <p>The tests you run here are the ones twd-cli runs on every pull request.</p>
      </li>
    </ul>
  </section>
</template>
