import { twd, userEvent, screenDom } from 'twd-js'
import { describe, it } from 'twd-js/runner'

describe('Chapter 1 · Your first test', () => {
  it('adds "hello" to the list', async () => {
    await twd.visit('/first-test')
    const user = userEvent.setup()

    const input = await screenDom.findByLabelText('New item')
    await user.type(input, 'hello')
    await user.click(await screenDom.findByRole('button', { name: 'Add' }))

    const list = await screenDom.findByRole('list', { name: 'Your list' })
    twd.should(list, 'have.text', 'hello')
    twd.should(input, 'have.value', '')
  })
})
