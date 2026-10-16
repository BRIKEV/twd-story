<script setup lang="ts">
import { ref } from 'vue'

const draft = ref('')
const items = ref<string[]>([])

function add() {
  const value = draft.value.trim()
  if (!value) return
  items.value.push(value)
  draft.value = ''
}
</script>

<template>
  <div class="demo">
    <form class="demo-form" @submit.prevent="add">
      <label for="new-item">New item</label>
      <div class="demo-row">
        <input id="new-item" v-model="draft" autocomplete="off" placeholder="Try “hello”" />
        <button type="submit" class="button primary" :disabled="!draft.trim()">Add</button>
      </div>
    </form>
    <ul v-if="items.length" class="demo-list" aria-label="Your list">
      <li v-for="(item, index) in items" :key="index">{{ item }}</li>
    </ul>
    <p v-else class="demo-empty">Nothing here yet.</p>
  </div>
</template>
