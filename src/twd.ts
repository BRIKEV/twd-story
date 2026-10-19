import { initTWD } from 'twd-js/bundled'

// Eager, so every test file lands in this one chunk. With the usual lazy glob
// initTWD fetches the files one after another, in order, and on a real network
// that waterfall held the sidebar back by a second or more.
const modules = import.meta.glob('./twd-tests/**/*.twd.test.ts', { eager: true })

// A normal app guards this with `import.meta.env.DEV`. This site ships the
// sidebar and its tests to production on purpose: the sidebar is the demo.
export function startTwd() {
  // initTWD expects loaders; the modules are already here, so hand them back
  const tests = Object.fromEntries(
    Object.entries(modules).map(([path, module]) => [path, () => Promise.resolve(module)]),
  )

  initTWD(tests, {
    // Only ever started on a wide screen (see main.ts), so it can start open
    open: true,
    position: 'left',
    pace: true,
    // Chapter 5 has the reader filter the sidebar down to the shop's tests
    search: true,
  })
}
