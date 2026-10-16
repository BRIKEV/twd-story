import { twd, userEvent, screenDom, expect } from 'twd-js'
import { describe, it } from 'twd-js/runner'

describe('Chapter 2 · Too fast?', () => {
  it('adds three todos, completes one, deletes one', async () => {
    await twd.visit('/speed')
    const user = userEvent.setup()

    const input = await screenDom.findByLabelText('New todo')
    for (const title of ['Write a test', 'Watch it run', 'Ship it']) {
      await user.type(input, title)
      await user.click(await screenDom.findByRole('button', { name: 'Add' }))
    }
    twd.should(await screenDom.findByRole('status'), 'have.text', '3 items left')

    await user.click(await screenDom.findByRole('checkbox', { name: 'Watch it run' }))
    twd.should(await screenDom.findByRole('checkbox', { name: 'Watch it run' }), 'be.checked')

    await user.click(await screenDom.findByRole('button', { name: 'Delete Ship it' }))

    const remaining = await screenDom.findAllByRole('checkbox')
    expect(remaining).to.have.length(2)
    twd.should(await screenDom.findByRole('status'), 'have.text', '1 item left')
  })
})
