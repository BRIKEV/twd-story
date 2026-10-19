<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import ChapterNav from './components/ChapterNav.vue'
import DesktopOnly from './components/DesktopOnly.vue'
import { useWideScreen } from './composables/useWideScreen'

const route = useRoute()
const wide = useWideScreen()
</script>

<template>
  <DesktopOnly v-if="!wide" />
  <RouterView v-else-if="route.meta.standalone" />
  <div v-else class="shell">
    <ChapterNav />
    <main class="page">
      <RouterView />
    </main>
  </div>
</template>
