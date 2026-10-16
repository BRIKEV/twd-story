<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

// twd.visit() remounts the current page by passing through a throwaway route
// for a few milliseconds. Waiting a beat keeps that from flashing this message.
const show = ref(false)
onMounted(() => setTimeout(() => (show.value = true), 300))
</script>

<template>
  <section v-if="show" class="not-found">
    <h1>Nothing here.</h1>
    <p><RouterLink to="/">Back to the start of the tour</RouterLink></p>
  </section>
</template>
