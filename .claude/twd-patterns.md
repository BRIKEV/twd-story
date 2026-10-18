# TWD Project Patterns

## Project Configuration

- **Framework**: Vue 3 (Vite+ toolchain, `vp`; pnpm)
- **Vite base path**: /
- **Dev server port**: 5173
- **App URL**: http://localhost:5173
- **Dev command**: pnpm dev
- **Default branch**: main
- **Entry point**: src/main.ts
- **Public folder**: public/
- **Type-check command**: pnpm type-check
- **Test lint**: twd-lint rules inside `vp lint` (vite.config.ts `lint.overrides`); run `vp check`
- **Closing run**: full suite

### Manual setup, on purpose

This site ships the TWD sidebar and its tests to **production**: the sidebar is
the product demo. So it does **not** use the `twd()` Vite plugin (dev-only) or
`removeMockServiceWorker()`. `src/main.ts` calls `initTWD` from
`twd-js/bundled` with no `import.meta.env.DEV` guard, and `twd-js` is a
runtime `dependency`. `pnpm sw` copies `public/mock-sw.js` before every dev run
and build (it is gitignored). Do not "fix" any of this.

### Runner Commands

twd-cli drives its own headless browser — only the dev server has to be up
(`pnpm dev`, or `pnpm dev:ci` for coverage). Use `pnpm exec`, not `npx`: the
package's devEngines pins pnpm.

```bash
# Run all tests
pnpm test:ci

# Run specific tests by name (matches "suite > test", case-insensitive; repeatable)
pnpm exec twd-cli run --test "adds \"hello\" to the list"
pnpm exec twd-cli run --test "Checkout" --test "Discounts"

# Only the tests this branch added or changed
pnpm exec twd-cli run --changed-since origin/main

# Record a run to video (one clip per matched test, needs ffmpeg 8+)
pnpm exec twd-cli run --record --test "places the order"

# Lint + format + type-check, including the twd-lint rules (no dev server needed)
vp check --fix
```

Every run writes `.twd/report/`: `run.json` (the result), `summary.md` and
`index.html`. The folder is replaced on each run.

## Standard Imports

```typescript
import { twd, userEvent, screenDom, expect } from 'twd-js'
import { describe, it, beforeEach, afterEach } from 'twd-js/runner'
```

## Visit Paths

Base path is `/`: `await twd.visit('/shop')`. Each chapter's tests visit the
route they test (`/first-test`, `/speed`, `/automate`, `/mocking`, `/shop`,
`/ship`).

## Standard beforeEach / afterEach

```typescript
beforeEach(() => {
  twd.clearRequestMockRules()
})

afterEach(() => {
  twd.clearRequestMockRules()
})
```

No store reset needed: the only Pinia store (`src/stores/shop.ts`) is reset by
`ShopApp.vue` on mount, and every test starts with `twd.visit`, which remounts
the page. Demo widgets in chapters 1–2 keep local component state for the same
reason.

## Rules specific to this site

- **Test names are tour copy.** Chapter views find their test by its exact `it`
  name (`TEST` constants and the `scenarios` list in `src/views/*View.vue`)
  to follow its status and pulse its ▶ button. Renaming an `it` means updating
  the view that names it, or the tour silently stops reacting.
- **Scope queries to the demo.** The page's own nav and tour card also contain
  lists, list items and buttons. Query by accessible name
  (`findByRole('list', { name: 'Todos from the API' })`), never a bare
  `findByRole('listitem')` or `findAllByRole('listitem')`.
- **Unmocked requests fail by design.** There is no backend. `src/api/http.ts`
  turns a non-JSON response into `NoBackendError` and the UI says "No backend
  answered". Mock every request a test triggers; mocked responses are JSON, so
  a mocked 500/404/402 reaches the app as an `HttpError`.
- **Test file order is the tour order.** Files are numbered (`01-…` to
  `06-…`) and Run All goes through them in that order. `06-finale` must stay
  last: it visits `/ship`, so Run All ends on the chapter that asked for it.
- **Suite names are wired too.** The shop tour finds its tests by the
  top-level describe `Chapter 5 · Bean & Leaf shop` (`SHOP_SUITE` in
  `src/composables/useShopRun.ts`), and readers filter the sidebar by typing
  `shop`, so that word must stay in the shop suite name and out of other
  suites' and tests' names.
- **Chapter 3's terminal shows real output.** When the total test count
  changes, update `ciOutput` in `src/views/AutomateView.vue` from a fresh
  `pnpm test:ci`.

## API Service Types

Service/API types are in `src/api/` (`todos.ts`, `shop.ts`, shared `http.ts`).
Read them for endpoint URLs and response shapes when writing mock data. Shared
fixtures live in `src/twd-tests/mocks/`.

## Portals and Dialogs

Use `screenDomGlobal` instead of `screenDom` for elements rendered in portals
(modals, dropdowns, tooltips):

```typescript
import { screenDomGlobal } from 'twd-js'
const modal = await screenDomGlobal.findByRole('dialog')
```
