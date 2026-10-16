<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { chapters } from '@/chapters'
const logo = '/favicon.svg'
</script>

<template>
  <header class="nav">
    <RouterLink to="/" class="brand">
      <img :src="logo" alt="" width="28" height="28" />
      <span>TWD</span>
    </RouterLink>
    <nav aria-label="Chapters">
      <ol class="chapters">
        <li v-for="chapter in chapters" :key="chapter.path">
          <RouterLink
            v-if="chapter.ready"
            :to="chapter.path"
            class="chapter-link"
            :title="chapter.title"
          >
            <span class="chapter-number">{{ chapter.number }}</span>
            <span class="chapter-title">{{ chapter.title }}</span>
          </RouterLink>
          <span v-else class="chapter-link is-soon" :title="`${chapter.title} — coming soon`">
            <span class="chapter-number">{{ chapter.number }}</span>
            <span class="chapter-title">{{ chapter.title }}</span>
          </span>
        </li>
      </ol>
    </nav>
    <a class="docs-link" href="https://twd.dev" target="_blank" rel="noopener">Docs ↗</a>
  </header>
</template>
