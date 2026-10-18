<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Chapter } from '@/chapters'

export interface TourStep {
  text: string
  state: 'todo' | 'active' | 'done'
}

defineProps<{
  steps: TourStep[]
  /** Colour of the message under the steps; no tone means nothing to say yet. */
  tone?: 'info' | 'success' | 'error'
  next?: Chapter
  /** The reader has done what the chapter asks, so the way forward opens. */
  unlocked: boolean
}>()
</script>

<template>
  <aside class="tour" aria-label="Tour">
    <p class="tour-hint" aria-hidden="true">← the sidebar</p>
    <ol class="tour-steps">
      <li v-for="step in steps" :key="step.text" :class="`is-${step.state}`">
        <span class="tour-mark" aria-hidden="true">{{ step.state === 'done' ? '✓' : '' }}</span>
        <span>
          <span class="visually-hidden">{{ step.state === 'done' ? 'Done: ' : '' }}</span>
          <span v-html="step.text" />
        </span>
      </li>
    </ol>
    <div class="tour-live" aria-live="polite">
      <div v-if="tone" class="tour-message" :class="`is-${tone}`">
        <slot />
      </div>
    </div>
    <template v-if="next">
      <RouterLink v-if="unlocked" :to="next.path" class="button primary">
        Chapter {{ next.number }}: {{ next.title }} →
      </RouterLink>
      <RouterLink v-else :to="next.path" class="skip-link">Skip ahead</RouterLink>
    </template>
  </aside>
</template>
