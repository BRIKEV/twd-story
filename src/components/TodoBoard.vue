<script setup lang="ts">
import { computed, ref } from 'vue'

interface Item {
  id: number
  title: string
  done: boolean
}

const draft = ref('')
const items = ref<Item[]>([])
let nextId = 1

const left = computed(() => items.value.filter((item) => !item.done).length)

function add() {
  const title = draft.value.trim()
  if (!title) return
  items.value.push({ id: nextId++, title, done: false })
  draft.value = ''
}

function remove(id: number) {
  items.value = items.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="demo">
    <form class="demo-form" @submit.prevent="add">
      <label for="new-todo">New todo</label>
      <div class="demo-row">
        <input id="new-todo" v-model="draft" autocomplete="off" placeholder="What needs doing?" />
        <button type="submit" class="button primary" :disabled="!draft.trim()">Add</button>
      </div>
    </form>
    <ul v-if="items.length" class="demo-list" aria-label="Todos">
      <li v-for="item in items" :key="item.id" :class="{ 'is-done': item.done }">
        <label class="demo-check">
          <input v-model="item.done" type="checkbox" />
          <span>{{ item.title }}</span>
        </label>
        <button
          type="button"
          class="icon-button"
          :aria-label="`Delete ${item.title}`"
          @click="remove(item.id)"
        >
          ✕
        </button>
      </li>
    </ul>
    <p v-else class="demo-empty">Nothing to do. Suspicious.</p>
    <p class="demo-footer" role="status">{{ left }} {{ left === 1 ? 'item' : 'items' }} left</p>
  </div>
</template>
