<script setup lang="ts">
defineProps<{
  command: string
  lines: string[]
  /** Reveals the output line by line; until then only the prompt shows. */
  play: boolean
}>()
</script>

<template>
  <section class="terminal" aria-label="Terminal">
    <div class="terminal-bar" aria-hidden="true">
      <span class="dot" /><span class="dot" /><span class="dot" />
      <span class="terminal-title">ci · ubuntu-latest</span>
    </div>
    <pre
      class="terminal-body"
    ><span class="terminal-prompt">$ </span>{{ command }}<span v-if="!play" class="terminal-cursor" aria-hidden="true">▍</span>
<template v-if="play"><span v-for="(line, index) in lines" :key="index" class="terminal-line" :style="{ animationDelay: `${index * 140}ms` }">{{ line }}
</span></template></pre>
  </section>
</template>
