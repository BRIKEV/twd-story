import { twd, userEvent, screenDom, expect } from 'twd-js'
import { describe, it, beforeEach, afterEach } from 'twd-js/runner'

const todos = [
  { id: '1', title: 'Mock the backend', done: true },
  { id: '2', title: 'Test the empty state', done: false },
  { id: '3', title: 'Test the error state', done: false },
]

describe('Chapter 4 · No backend? Mock it', () => {
  beforeEach(() => {
    twd.clearRequestMockRules()
  })

  afterEach(() => {
    twd.clearRequestMockRules()
  })

  it('shows the todos the API returns', async () => {
    await twd.mockRequest('getTodos', { method: 'GET', url: '/api/todos', response: todos })
    await twd.visit('/mocking')

    const list = await screenDom.findByRole('list', { name: 'Todos from the API' })
    twd.should(list, 'contain.text', 'Mock the backend')
    twd.should(list, 'contain.text', 'Test the error state')
  })

  it('shows an empty state when there are no todos', async () => {
    await twd.mockRequest('getTodos', { method: 'GET', url: '/api/todos', response: [] })
    await twd.visit('/mocking')

    await screenDom.findByText('No todos yet. Add your first one.')
  })

  it('shows an error when the server fails', async () => {
    await twd.mockRequest('getTodos', {
      method: 'GET',
      url: '/api/todos',
      response: { message: 'Internal error' },
      status: 500,
    })
    await twd.visit('/mocking')

    await screenDom.findByText('The server had a problem loading your todos.')
  })

  it('recovers when the server comes back', async () => {
    await twd.mockRequest('getTodos', {
      method: 'GET',
      url: '/api/todos',
      response: { message: 'Internal error' },
      status: 500,
    })
    await twd.visit('/mocking')
    const retry = await screenDom.findByRole('button', { name: 'Try again' })

    // Same alias: the new rule replaces the failing one
    await twd.mockRequest('getTodos', { method: 'GET', url: '/api/todos', response: todos })
    await userEvent.click(retry)

    await screenDom.findByRole('list', { name: 'Todos from the API' })
  })

  it('shows a loading state while the API is slow', async () => {
    await twd.mockRequest('getTodos', {
      method: 'GET',
      url: '/api/todos',
      response: todos,
      delay: 1500,
    })
    await twd.visit('/mocking')

    await screenDom.findByText('Loading todos…')
    await screenDom.findByRole('list', { name: 'Todos from the API' }, { timeout: 3000 })
  })

  it('sends a new todo to the API', async () => {
    await twd.mockRequest('getTodos', { method: 'GET', url: '/api/todos', response: [] })
    await twd.mockRequest('createTodo', {
      method: 'POST',
      url: '/api/todos',
      response: { id: '9', title: 'Ship it', done: false },
      status: 201,
    })
    await twd.visit('/mocking')

    const user = userEvent.setup()
    await user.type(await screenDom.findByLabelText('New todo'), 'Ship it')
    await user.click(await screenDom.findByRole('button', { name: 'Add' }))

    const rule = await twd.waitForRequest('createTodo')
    expect(rule.request).to.deep.equal({ title: 'Ship it' })
    twd.should(
      await screenDom.findByRole('list', { name: 'Todos from the API' }),
      'contain.text',
      'Ship it',
    )
  })
})
