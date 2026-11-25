# twd-story design guide

For building HTML prototypes (Tailwind + Alpine.js) that look and behave like this site.
Source of truth: `src/assets/main.css` (every style lives there), `src/components/`, `src/views/`.

## 1. Product

twd-story is the marketing site for TWD (Test While Developing), deployed at `https://try.twd.dev/`. It is a
guided tour in 7 chapters (0–6): the real TWD test sidebar ships to production, docked on the left, and the
reader presses ▶ on real tests that drive the page they are reading. Each chapter watches the sidebar's run
state and reacts (step checklist, success/error message, unlocks the next chapter). Audience: front-end
developers evaluating a test runner. Tone: direct, second person, short sentences, a little dry humour
("Nothing to do. Suspicious."). Light theme only (`color-scheme: light`). English only.

## 2. Tokens

The project uses **plain CSS custom properties, not Tailwind**. Prototypes should use Tailwind arbitrary values
or this theme extension, which maps 1:1 to `:root` in `src/assets/main.css`:

```js
tailwind.config = { theme: { extend: {
  colors: {
    navy: '#123956', 'navy-2': '#1a5270', teal: '#2faaae', 'teal-ink': '#1a7c80',
    ink: '#0f1f2e', 'ink-2': '#44566a', 'ink-3': '#6b7c8f',
    paper: '#f7f9fb', card: '#ffffff', line: '#dde4eb',
    success: '#15803d', 'success-bg': '#e8f6ee', error: '#b42318', 'error-bg': '#fdeceb', 'info-bg': '#eef5f9',
  },
  borderRadius: { card: '14px' },
  boxShadow: { card: '0 1px 2px rgb(15 31 46 / 6%), 0 8px 24px rgb(15 31 46 / 8%)' },
}}}
```

### Colors (tour)

| Token | Value | Role |
|---|---|---|
| `--navy` | `#123956` | Primary: primary button bg, h1/h2 color, brand, active chapter number |
| `--navy-2` | `#1a5270` | Primary button hover |
| `--teal` | `#2faaae` | Accent: focus ring, progress bar, active step ring, busy stage ring, spotlight pulse, terminal prompt |
| `--teal-ink` | `#1a7c80` | Links, eyebrows, "← the sidebar" hint, code in skill list |
| `--ink` | `#0f1f2e` | Body text |
| `--ink-2` | `#44566a` | Secondary text: lede, paragraphs in cards, labels |
| `--ink-3` | `#6b7c8f` | Muted: empty states, todo steps, counters, skip link, disabled button text |
| `--paper` | `#f7f9fb` | Page background |
| `--card` | `#ffffff` | Surface: cards, stage, dropdowns |
| `--line` | `#dde4eb` | Borders, dividers, disabled button bg, progress track |
| `--success` / `--success-bg` | `#15803d` / `#e8f6ee` | Done step mark, success message, tags, past chapter |
| `--error` / `--error-bg` | `#b42318` / `#fdeceb` | Error text/border, error message, delete hover |
| `--info-bg` | `#eef5f9` | Hover bg for secondary buttons and menu rows; info message |

Dark surfaces (hard-coded, not tokens): code block/snippet `#0f1f2e` with text `#dbe7f0`; terminal `#0b1722`,
terminal bar `#13212e`, terminal dots `#2b3b4a`, terminal title `#7f93a6`. Stage (browser frame) bar `#eef2f6`,
dots `#cfd8e1`.

### Colors (Bean & Leaf shop, `/shop` only, scoped under `.site`)

`--shop-bg #fbf7f0`, `--shop-ink #2d2418`, `--shop-accent #2f6b3f` (primary button), `--shop-accent-2 #3c8350`
(hover), `--shop-line #eadfcd`, secondary text `#7a6a55` (hard-coded). Headings in `Georgia, 'Times New Roman', serif`.

### Type

- Sans: `ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`.
  Mono: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. No web fonts.
- Body 17px / line-height 1.6. h1, h2: line-height 1.1, letter-spacing -0.02em, color navy.
- Hero h1 `clamp(44px, 7vw, 88px)`; chapter h1 `clamp(36px, 5vw, 56px)`; section h2 32px; feature h2 28px;
  sub-h2 22px; card h2 17px.
- Lede 20px ink-2, max-width 640px. Buttons 15px/600 (small 14px, large 17px). Secondary copy 15px. Labels 14px/600.
- Eyebrow: 14px, 700, uppercase, letter-spacing 0.08em, teal-ink. Small caps labels (tour hint, chapter count):
  12–13px, 700, uppercase, letter-spacing 0.06em.
- Code in prose 0.9em mono; code blocks 13–14px.

### Spacing, radius, shadow

- No spacing scale; common values: 4, 8, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 72, 80, 96px.
- Radius: `--radius` 14px (cards, stage, terminal); 10px (buttons, inputs, messages); 12px (list cards, dropdown,
  snippet); 16px (shop cards); 24px (finale block); 999px (pills, progress); 50% (step marks, chapter numbers).
- `--shadow`: `0 1px 2px rgb(15 31 46 / 6%), 0 8px 24px rgb(15 31 46 / 8%)`. Floating shop tour card:
  `0 12px 40px rgb(15 31 46 / 22%)`. Secondary button uses `inset 0 0 0 1px var(--line)` instead of a border.
- Focus: `:focus-visible { outline: 3px solid #2faaae; outline-offset: 2px }`. Input focus: border teal +
  `0 0 0 3px rgb(47 170 174 / 20%)`.

## 3. Layout

- `.page`: max-width 1180px, centered, padding `0 32px 96px` (≤640px: `0 16px 64px`).
- Header `.nav`: sticky top, z 10, `padding 12px 32px`, bg `rgb(247 249 251 / 88%)` + `backdrop-filter: blur(8px)`,
  bottom border line. Left: brand (28px favicon + "TWD", 800, letter-spacing 0.04em). Center: ‹ chapter menu ›.
  Right: "Docs ↗" link (14px/600).
- Chapter menu: a `<details>` whose summary shows "CHAPTER n OF 6 · Title ▾" and a 3px teal progress bar; it opens
  a 260px card listing all chapters with round number badges (past = success colors, current = navy/white).
  Prev/next are 32×32 arrow links; missing ones render at 25% opacity.
- The TWD sidebar (third-party, `twd-js`) docks on the **left** and shifts `<html>` right by its width while open.
  Starts open at ≥1048px; below that it overlays and starts closed. Prototypes must leave the left edge free.
- Chapter screen: `.chapter-head` (padding `56px 0 32px`: eyebrow "Chapter n", h1, lede) then `.chapter-body`,
  a 2-column grid `5fr / 6fr`, gap 32px: left = TourCard + collapsible test source; right = sticky (top 80px)
  stage or terminal. ≤1279px collapses to one column with the stage first.
- Hero (`/`): eyebrow, huge h1, lede, actions row (primary large button + `npm i -D twd-js` code chip), a note with a
  3px teal left border, then a 4-column facts grid (2 cols ≤1199px, 1 col ≤560px).
- `/shop` has no tour chrome: own sticky header, max-width 1080px, padding 0 40px, grid `1fr / 340px` (catalog +
  sticky cart), plus a fixed 360px tour card bottom-right (full-width, 8px inset, on ≤640px).
- Breakpoints in use: 560, 640, 1023/1024, 1048 (sidebar), 1100, 1199, 1279px.

## 4. Components

- **Button** `.button`: inline-flex, gap 8px, `padding 10px 18px`, radius 10px, 15px/600.
  - default (secondary): white bg, navy text, 1px inset line; hover info-bg. Used for "Back to cart", "Keep shopping", "Star on GitHub".
  - `.primary`: navy bg, white text; hover navy-2. The one forward action per area ("Add", "Try again", "Chapter n: Title →").
  - `.small` `6px 12px`/14px (product "Add", "Apply"); `.large` `14px 26px`/17px (hero CTAs); `.wide` 100% (Checkout).
  - disabled: line bg, ink-3 text, no hover. Links styled as buttons use the same classes.
- **Icon button** `.icon-button`: transparent, ink-3, `4px 8px`, radius 6px; hover error-bg/error (used for ✕, −, +, ▾). Text glyphs, no icon library.
- **TourCard** (`TourCard.vue`): white card, radius 14, padding 24, shadow. Top hint "← THE SIDEBAR" (teal-ink caps).
  Ordered steps: 26px circle mark + text; `todo` = ink-3 text, line border; `active` = teal border + 4px teal 18%
  ring; `done` = filled success circle with white ✓. Below, an `aria-live` message box (radius 10, padding 14×16)
  in `is-info` / `is-success` / `is-error` tone. Then either a primary "Chapter n: Title →" button (unlocked) or a
  muted "Skip ahead" link.
- **StageFrame**: fake browser window around the demo app: bar with three 10px dots, mono URL pill, and
  "● test running" in teal-ink while busy; busy also turns the border teal with a 4px teal 20% ring. Body min-height 340px, padding 28px.
- **TerminalReplay**: dark window titled `ci · ubuntu-latest`, teal `$` prompt, blinking ▍ cursor; lines fade in 140ms apart.
- **TestSource**: `<details>` card, summary "Read the test you're running `file.ts`", opens a dark `<pre>`.
- **Inputs**: `padding 10px 14px` (shop: `8px 12px`), 1px line border, radius 10px, label above (14px/600 ink-2).
  Input + submit button sit in a flex row, gap 8px. Checkboxes 18px with `accent-color: navy`.
- **Lists** `.demo-list`: rows with 12px vertical padding and bottom border; new rows animate `pop-in` (fade + 4px slide, 0.25s). Done rows strike through in ink-3.
- **Tag** `.demo-tag`: pill, success-bg/success, 12px/600 ("done").
- **Info cards**: `.facts li`, `.test-groups li`, `.skill-list li`, `.proof a`: white, 1px line border, radius 12–14, padding 14–22. `.proof a` hover: teal border + shadow.
- **Code chip / snippet**: `.install` white chip with line border; `.snippet` dark block radius 12.
- **Feature video**: native `<video>` with controls, muted loop, radius 14, poster image.
- No modals, toasts or tables (cart totals use a `<dl>`).

## 5. States

- **Loading**: centered ink-3 text, 40px vertical margin, `role="status"`: "Loading todos…", "Loading the shop…". No spinners or skeletons. Buttons in flight change label ("Placing order…") and disable.
- **Empty**: centered ink-3 line: "Nothing here yet.", "No todos yet. Add your first one.", "Your cart is empty.", "Nothing to do. Suspicious."
- **No backend** (default state of any API demo, since the site has no server): dashed 1px error border, error-bg, radius 12, padding 20; bold red title "No backend answered." + explanation telling the reader to run a test.
- **Error**: same box as no-backend with a message and a primary "Try again" button. Inline field/form errors: 14px error text under the field (`.demo-inline-error`).
- **Success**: TourCard `is-success` message, usually opening with a bold summary ("Passed in 0.2s."); shop order: centered card with a 56px success-bg circle ✓.
- **Running**: TourCard `is-info` message ("Watch the app…") + busy stage ring.
- **Spotlight**: the sidebar element to click next pulses with a teal ring (1.4s loop); static ring under `prefers-reduced-motion`.

## 6. Content

- Vocabulary: tour, chapter ("Chapter 3 of 6"), the sidebar, test, run / Run All / Run Filtered, Speed, Filter tests, mock, stage/app under test (aria only), Bean & Leaf, cart, discount code, checkout, order.
- Test names are quoted verbatim in copy and bolded (`<strong>adds "hello" to the list</strong>`); a test name is part of the UI copy.
- Tone: second person, imperative steps ("Press ▶ next to it, then watch the app"), short sentences, full stops even in errors ("Enter your name.", "That code doesn't exist."). Errors say what happened and what to do next. Contractions are fine.
- Glyphs: → forward CTA, ← back, ↗ external link, ▶ run button.
- Numbers: durations in seconds with one decimal ("6.3s", from `(ms/1000).toFixed(1)`); pace in ms ("200ms a step"). Prices: `Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })`, stored in cents → "€12.50". Pluralize "item/items". Dates: none shown (unknown format).
- Language: English, `lang="en"`. Curly quotes in copy (“hello”).

## 7. Screens

- `/` Meet TWD: hero, install chip, four facts.
- `/first-test` Your first test: run one test that types "hello" into a list.
- `/speed` Too fast?: set Speed to Slow and watch a longer todo test.
- `/automate` Automate it (h1 "Slow is for humans"): replay chapters 1–2, CI terminal, feature videos.
- `/mocking` No backend? Mock it: six mocked API scenarios; 3 passes unlock the next chapter.
- `/real-app` Test a real app: intro card for the shop + list of its test groups.
- `/shop` Bean & Leaf: standalone shop (catalog, cart, discount, checkout, order done) + floating tour card.
- `/ship` Run it all: Run All, proof links, twd-ai skills, install finale.
- `/*` Not found: "Nothing here." (shown after a 300ms delay).

## 8. Where things are

- Router: `src/router.ts` (routes; `meta.standalone` skips the tour chrome). Chapter list/order/titles: `src/chapters.ts`.
- Shell: `src/App.vue` renders `ChapterNav` + `<main class="page">` unless the route is standalone.
- Pages: `src/views/*View.vue`, one per route. A view imports components directly from `src/components/` and composes `TourCard` + `TestSource` + `StageFrame` around a demo widget.
- Shared components: `src/components/` (tour UI and demo widgets); shop feature: `src/components/shop/` with its Pinia store `src/stores/shop.ts` and API `src/api/shop.ts`.
- Sidebar-following logic: `src/composables/` (`useTwdTest`, `useTwdSuite`, `useTwdFilter`, `useTwdPace`, `useSpotlight`, `useShopRun`).
- HTTP + "no backend" detection: `src/api/http.ts`. External links: `src/links.ts`.
- Tests the reader runs: `src/twd-tests/*.twd.test.ts` (mocks in `src/twd-tests/mocks/`). TWD bootstrap: `src/twd.ts`.
- Tokens and **all** styles: `src/assets/main.css` (global class names; Vue files have no `<style>` blocks).

## 9. Known gaps

- No Tailwind and no design-token file beyond `:root`; several colors are hard-coded (`#0f1f2e` duplicated, terminal palette, `#eef2f6`, `#7a6a55`).
- Shop palette is duplicated: `.real-app-card` hard-codes `#fbf7f0`, `#eadfcd`, `#2d2418`, `#2f6b3f` instead of the `--shop-*` vars (they're scoped to `.site`).
- Shop cart rows use the tour's `--line` border, not `--shop-line`; `.cart h3` relies on `--shop-ink`, undefined outside `.site`.
- Chapter titles differ from page h1s: "Automate it" vs "Slow is for humans", "No backend? Mock it" vs "No backend? Mock it.".
- `.icon-button` hover is always red (error) even for +/− and collapse controls.
- No dark mode, no spacing scale, no icon set, no modal/toast/table components.
- `TourCard` renders step text with `v-html`, and `MockingView` renders its lessons the same way, so copy carries raw HTML (`<strong>`, `<code>`).

## 10. Constraints

- Vue 3 SFCs + plain CSS classes in `src/assets/main.css`. A prototype's Tailwind must translate to these tokens and existing class names; new styles go into `main.css` as BEM-ish global classes, not utility soup.
- Keep the left side clear for the TWD sidebar (docked left, open by default at ≥1048px); never place fixed UI on the left edge. Fixed overlays go bottom-right (like `.shop-tour`).
- Every interactive element needs an accessible name (tests query by role/label/text); reuse `aria-label` patterns like "Add {name} to cart". Live feedback goes in `aria-live="polite"` or `role="status"/"alert"`.
- Don't rename test names or the describe `Chapter 5 · Bean & Leaf shop` without updating chapter copy.
- No backend exists: any API-driven UI must handle loading, no-backend (`BackendMissing`), error with retry, and empty.
- Component state that must survive a test run can't live in components (`twd.visit()` remounts pages); keep it at module level or in a store.
- Respect `prefers-reduced-motion` for any animation.
- Phone width works: one column, 16px gutters, no horizontal scroll.
