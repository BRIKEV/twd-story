import { twd, userEvent, screenDom } from 'twd-js'
import { describe, it } from 'twd-js/runner'

describe('Chapter 3 · Automate it', () => {
  it('replays chapters 1 and 2 at full speed', async () => {
    const user = userEvent.setup()

    await twd.visit('/first-test')
    await user.type(await screenDom.findByLabelText('New item'), 'hello')
    await user.click(await screenDom.findByRole('button', { name: 'Add' }))
    twd.should(await screenDom.findByRole('list', { name: 'Your list' }), 'have.text', 'hello')

    await twd.visit('/speed')
    const input = await screenDom.findByLabelText('New todo')
    for (const title of ['Write a test', 'Watch it run', 'Ship it']) {
      await user.type(input, title)
      await user.click(await screenDom.findByRole('button', { name: 'Add' }))
    }
    await user.click(await screenDom.findByRole('checkbox', { name: 'Watch it run' }))
    await user.click(await screenDom.findByRole('button', { name: 'Delete Ship it' }))
    twd.should(await screenDom.findByRole('status'), 'have.text', '1 item left')

    await twd.visit('/automate')
    await screenDom.findByRole('heading', { name: 'Slow is for humans' })
  })
})
