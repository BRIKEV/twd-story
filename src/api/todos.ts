import { request } from './http'

export interface Todo {
  id: string
  title: string
  done: boolean
}

export const fetchTodos = () => request<Todo[]>('/api/todos')

export const createTodo = (title: string) =>
  request<Todo>('/api/todos', { method: 'POST', body: JSON.stringify({ title }) })
