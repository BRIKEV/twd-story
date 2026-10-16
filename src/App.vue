<script setup lang="ts">
import { RouterView } from 'vue-router'
import ChapterNav from './components/ChapterNav.vue'
</script>

<template>
  <div class="shell">
    <ChapterNav />
    <main class="page">
      <RouterView />
    </main>
  </div>
</template>
