<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { LAST_CHAPTER, chapterAfter, chapterAt, chapterBefore, chapters } from '@/chapters'

const logo = '/favicon.svg'
const route = useRoute()

const current = computed(() => chapterAt(route.path))
const previous = computed(() => chapterBefore(route.path))
const next = computed(() => chapterAfter(route.path))
const progress = computed(() => ((current.value?.number ?? 0) / LAST_CHAPTER) * 100)

// Close the chapter list once the reader picks a chapter
const menu = ref<HTMLDetailsElement | null>(null)
watch(
  () => route.path,
  () => menu.value?.removeAttribute('open'),
)
</script>

<template>
  <header class="nav">
    <RouterLink to="/" class="brand">
      <img :src="logo" alt="" width="28" height="28" />
      <span>TWD</span>
    </RouterLink>

    <nav v-if="current" class="tour-nav" aria-label="Tour">
      <RouterLink
        v-if="previous"
        :to="previous.path"
        class="tour-arrow"
        :aria-label="`Previous: ${previous.title}`"
        >‹</RouterLink
      >
      <span v-else class="tour-arrow is-off" aria-hidden="true">‹</span>

      <details ref="menu" class="tour-menu">
        <summary>
          <span class="tour-where">
            <span class="tour-count">
              {{ current.number === 0 ? 'Tour' : `Chapter ${current.number} of ${LAST_CHAPTER}` }}
            </span>
            <span class="tour-title">{{ current.title }}</span>
          </span>
          <span class="tour-progress" aria-hidden="true">
            <span :style="{ width: `${progress}%` }" />
          </span>
        </summary>
        <ol class="tour-list">
          <li v-for="chapter in chapters" :key="chapter.path">
            <RouterLink :to="chapter.path" :class="{ 'is-past': chapter.number < current.number }">
              <span class="chapter-number">{{ chapter.number }}</span>
              {{ chapter.title }}
            </RouterLink>
          </li>
        </ol>
      </details>

      <RouterLink v-if="next" :to="next.path" class="tour-arrow" :aria-label="`Next: ${next.title}`"
        >›</RouterLink
      >
      <span v-else class="tour-arrow is-off" aria-hidden="true">›</span>
    </nav>

    <a class="docs-link" href="https://twd.dev" target="_blank" rel="noopener">Docs ↗</a>
  </header>
</template>
