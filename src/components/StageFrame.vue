<script setup lang="ts">
defineProps<{ url: string; busy?: boolean }>()
</script>

<template>
  <section class="stage" :class="{ 'is-busy': busy }" aria-label="The app under test">
    <div class="stage-bar" aria-hidden="true">
      <span class="dot" /><span class="dot" /><span class="dot" />
      <span class="stage-url">{{ url }}</span>
      <span v-if="busy" class="stage-live">● test running</span>
    </div>
    <div class="stage-body">
      <slot />
    </div>
  </section>
</template>
