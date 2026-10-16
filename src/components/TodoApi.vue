<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { createTodo, fetchTodos, type Todo } from '@/api/todos'
import { HttpError, NoBackendError } from '@/api/http'
import BackendMissing from './BackendMissing.vue'

type State = 'loading' | 'ready' | 'no-backend' | 'error'

const state = ref<State>('loading')
const todos = ref<Todo[]>([])
const draft = ref('')
const saving = ref(false)
const saveError = ref<string | null>(null)

async function load() {
  state.value = 'loading'
  try {
    todos.value = await fetchTodos()
    state.value = 'ready'
  } catch (error) {
    state.value = error instanceof NoBackendError ? 'no-backend' : 'error'
  }
}

async function add() {
  const title = draft.value.trim()
  if (!title) return
  saving.value = true
  saveError.value = null
  try {
    todos.value.push(await createTodo(title))
    draft.value = ''
  } catch (error) {
    saveError.value =
      error instanceof HttpError ? `Couldn't save (${error.status}).` : "Couldn't reach the server."
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="demo">
    <p v-if="state === 'loading'" class="demo-loading" role="status">Loading todos…</p>

    <BackendMissing v-else-if="state === 'no-backend'" />

    <div v-else-if="state === 'error'" class="demo-error" role="alert">
      <p>The server had a problem loading your todos.</p>
      <button type="button" class="button primary" @click="load">Try again</button>
    </div>

    <template v-else>
      <form class="demo-form" @submit.prevent="add">
        <label for="api-todo">New todo</label>
        <div class="demo-row">
          <input
            id="api-todo"
            v-model="draft"
            autocomplete="off"
            placeholder="Saved through the API"
          />
          <button type="submit" class="button primary" :disabled="!draft.trim() || saving">
            Add
          </button>
        </div>
        <p v-if="saveError" class="demo-inline-error" role="alert">{{ saveError }}</p>
      </form>
      <ul v-if="todos.length" class="demo-list" aria-label="Todos from the API">
        <li v-for="todo in todos" :key="todo.id" :class="{ 'is-done': todo.done }">
          <span>{{ todo.title }}</span>
          <span v-if="todo.done" class="demo-tag">done</span>
        </li>
      </ul>
      <p v-else class="demo-empty">No todos yet. Add your first one.</p>
    </template>
  </div>
</template>
