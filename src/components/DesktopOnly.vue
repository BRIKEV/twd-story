<script setup lang="ts">
import { ref } from 'vue'
import { links } from '@/links'

const logo = '/favicon.svg'
const copied = ref(false)

async function shareLink() {
  const url = window.location.origin
  try {
    if (navigator.share) await navigator.share({ title: 'TWD: a live tour', url })
    else {
      await navigator.clipboard.writeText(url)
      copied.value = true
    }
  } catch {
    // The reader closed the share sheet; nothing to do
  }
}
</script>

<template>
  <main class="desktop-only">
    <img :src="logo" alt="" width="48" height="48" />
    <p class="eyebrow">Test While Developing</p>
    <h1>This tour needs a bigger screen.</h1>
    <p class="lede">
      It's a live demo: real tests run in a sidebar next to the page and drive it while you watch.
      That needs a laptop or desktop browser to fit both side by side.
    </p>
    <p class="desktop-only-note">
      That's a limit of this showcase, not of TWD. The apps you test with TWD can be any size; the
      sidebar is a tool for your development browser.
    </p>
    <div class="desktop-only-actions">
      <button type="button" class="button primary large" @click="shareLink">
        {{ copied ? 'Link copied' : 'Send it to your laptop' }}
      </button>
      <a class="button large" :href="links.docs">Read the docs</a>
    </div>
  </main>
</template>
