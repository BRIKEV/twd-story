<script setup lang="ts">
defineProps<{ source: string; file: string }>()
</script>

<template>
  <details class="source">
    <summary>
      Read the test you're running <code>{{ file }}</code>
    </summary>
    <pre><code>{{ source.trim() }}</code></pre>
  </details>
</template>
