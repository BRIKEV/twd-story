import { twd, screenDom } from 'twd-js'
import { describe, it } from 'twd-js/runner'

describe('Chapter 6 · Run it all', () => {
  it('ends the tour where it started', async () => {
    await twd.visit('/ship')

    twd.should(await screenDom.findByRole('heading', { level: 1 }), 'have.text', 'Run it all')
  })
})
