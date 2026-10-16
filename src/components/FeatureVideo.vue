<script setup lang="ts">
defineProps<{ src: string; poster: string; label: string }>()
</script>

<template>
  <video
    class="feature-video"
    :src="src"
    :poster="poster"
    :aria-label="label"
    preload="none"
    muted
    loop
    playsinline
    controls
  />
</template>
