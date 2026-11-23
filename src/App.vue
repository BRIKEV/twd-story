<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import ChapterNav from './components/ChapterNav.vue'

const route = useRoute()
</script>

<template>
  <RouterView v-if="route.meta.standalone" />
  <div v-else class="shell">
    <ChapterNav />
    <main class="page">
      <RouterView />
    </main>
  </div>
</template>
