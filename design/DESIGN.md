# DESIGN.md — twd-story

## 1. Product

Public marketing site (try.twd.dev) for front-end developers: a live tour of TWD, an in-browser test runner. The TWD sidebar ships to production on purpose; the reader presses ▶ on real tests and they drive the page being read. 7 chapters (0–6) plus Bean & Leaf (`/shop`), a demo shop with a warmer look. No backend: every API answer is a test mock. Tone: direct, second person, a bit playful ("Nothing to do. Suspicious.").

## 2. Tokens

The site uses plain CSS custom properties in `src/assets/main.css`, not Tailwind. Here they are mapped for Tailwind 4 `@theme`:

```css
@theme {
  --color-primary: #123956;        /* navy: primary buttons, h1/h2, brand, active chapter */
  --color-primary-hover: #1a5270;  /* navy-2: primary button hover */
  --color-accent: #2faaae;         /* teal: focus ring, progress bar, busy stage, spotlight */
  --color-accent-ink: #1a7c80;     /* teal-ink: links, eyebrows, tour hint, "test running" */
  --color-text: #0f1f2e;           /* ink: body text */
  --color-text-2: #44566a;         /* ink-2: secondary text, ledes, labels */
  --color-muted: #6b7c8f;          /* ink-3: muted text, empty states, disabled text */
  --color-surface: #f7f9fb;        /* paper: page background */
  --color-card: #ffffff;           /* card: cards, buttons, inputs */
  --color-line: #dde4eb;           /* borders, dividers, disabled button bg */
  --color-success: #15803d;        /* success text, done step marks */
  --color-success-bg: #e8f6ee;     /* success message, tag background */
  --color-danger: #b42318;         /* error text, dashed error border */
  --color-danger-bg: #fdeceb;      /* error box, delete button hover */
  --color-info-bg: #eef5f9;        /* info message, hover background */
  --color-code-bg: #0f1f2e;        /* code blocks, snippets (text #dbe7f0) */
  --color-terminal-bg: #0b1722;    /* terminal, video bg */
  /* Bean & Leaf, scoped to .site */
  --color-shop-bg: #fbf7f0;        /* shop page background */
  --color-shop-ink: #2d2418;       /* shop text, headings */
  --color-shop-accent: #2f6b3f;    /* shop primary buttons */
  --color-shop-accent-2: #3c8350;  /* shop primary hover */
  --color-shop-line: #eadfcd;      /* shop borders */
  --color-shop-muted: #7a6a55;     /* shop links, prices, hero text */
  --font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; /* everything */
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; /* code, URLs, terminal */
  --font-serif: Georgia, 'Times New Roman', serif; /* Bean & Leaf name and headings only */
  --radius-card: 14px;   /* cards, stage, tour card, source */
  --radius-control: 10px; /* buttons, inputs, messages */
  --radius-shop: 16px;   /* shop product, cart, checkout */
  --radius-pill: 999px;  /* tags, cart badge, progress */
  --shadow-card: 0 1px 2px rgb(15 31 46 / 6%), 0 8px 24px rgb(15 31 46 / 8%); /* raised cards */
  --shadow-float: 0 12px 40px rgb(15 31 46 / 22%); /* floating shop tour card */
  --shadow-focus: 0 0 0 3px rgb(47 170 174 / 20%); /* input focus */
}
```

Type: body 17px/1.6; hero h1 clamp(44px,7vw,88px), chapter h1 clamp(36px,5vw,56px), both 1.1 and -0.02em; section h2 32px, feature h2 28px, lede 20px, button 15px; eyebrow 14px/700 uppercase 0.08em; meta 12–13px. Focus: `outline: 3px solid #2faaae; offset 2px`.

Spacing: gaps 8/12/16/24/32px; card padding 20–28px; section rhythm 56/72/80/96px.

## 3. Layout

- **Tour pages** (`App.vue`): sticky `header.nav` (12px 32px, paper at 88% + 8px blur, bottom border: brand left, chapter switcher centre, "Docs ↗" right), then `main.page`, max-width 1180px, padding 0 32px 96px (16px under 640px).
- **Chapter screen**: `header.chapter-head` (eyebrow "Chapter N", h1, lede), then `.chapter-body`, a 5fr/6fr grid: TourCard + TestSource left, sticky `StageFrame` (top 80px) with a demo widget right; one column under 1280px, stage first. Extra sections may follow (`.features`, `.proof`, `.skills`, `.finale`).
- **Standalone** (`meta.standalone`, only `/shop`): sticky `header.shop-head` (16px 40px), `main.shop-main` max 1080px, `.shop-browse` = product grid (auto-fill minmax 180px) + 340px sticky cart (one column under 1100px), fixed 360px `aside.shop-tour` bottom-right.
- The TWD sidebar sits left and pushes `<html>` right while open (open by default at ≥1048px).

## 4. Components

- **Button** `.button`: padding 10px 18px, radius 10px, weight 600, white bg, navy text, inset 1px line. Secondary action ("Back to cart", "Keep shopping", "Star on GitHub").
  - `.primary`: navy bg, white text (green inside `.site`). Main action: "Add", "Checkout", "Place order", "Try again", "Chapter N: Title →".
  - `.small` 6px 12px/14px, `.large` 14px 26px/17px (hero CTAs), `.wide` 100%. Disabled: line bg, muted text. RouterLinks use the same classes.
- **Icon button** `.icon-button`: transparent, 4px 8px, muted glyph (✕ − + ▾ ▴); hover danger on danger-bg; disabled opacity .35.
- **Input**: 1px line border, radius 10px, padding 10px 14px (shop 8px 12px); focus = teal border + 3px teal shadow. Label above: 14px/600, ink-2.
- **Card**: white, 1px line border, radius 14px (`.facts li`, `.test-groups li`, `.skill-list li`, `.proof a` with teal hover border; shop `.product`, `.cart`, `.checkout`).
- **TourCard**: hint "← the sidebar", then a numbered list of steps. Each step has a 26px circle mark: todo is muted, active has a teal ring and a 4px glow, done is green with ✓. Below is an `aria-live` message box, then either the next-chapter primary button (once unlocked) or a "Skip ahead" link.
- **Message box** `.tour-message`: 14px 16px, radius 10px, in `.is-info`, `.is-success` or `.is-error` (error-bg with error text).
- **StageFrame**: browser window (3 grey dots, mono URL pill, "● test running" while busy; busy = teal border + 4px ring); body padding 28px, min-height 340px.
- **TestSource**: `<details>` "Read the test you're running `file`" with a dark `<pre>`. **TerminalReplay**: dark terminal "ci · ubuntu-latest", lines fade in 140ms apart.
- **Tag** `.demo-tag`: 12px success pill ("done"). **List rows** `.demo-list li`: bottom border, pop-in; done = struck through, muted.
- No modals, toasts or tables exist. The cart totals use a `<dl>`.

## 5. States

- **Loading**: centred muted text with `role="status"`: "Loading todos…", "Loading the shop…". Buttons show "Placing order…" while disabled.
- **Empty**: centred muted `p.demo-empty`: "Nothing here yet.", "Nothing to do. Suspicious.", "No todos yet. Add your first one.", "Your cart is empty."
- **Error (load)**: `.demo-error` (dashed 1px danger border, danger-bg, radius 12px, padding 20px), `role="alert"`, message + primary "Try again". **No backend**: `BackendMissing`, same box, bold red "No backend answered." + explanation.
- **Inline error**: `p.demo-inline-error`, 14px danger text under the control.
- **Success**: `.tour-message.is-success`. The shop's OrderDone is a centred card with a 56px green ✓ circle, "Order {id} is on its way" and `role="status"`.
- **Running test**: teal busy stage plus an info message ("Watch the app…").
- **Sold out / at stock limit**: disabled button, plus "Only N in stock" under the cart line.

## 6. Accessibility and naming

- **Tour header** (`ChapterNav.vue`):
  - Brand link: the logo has `alt=""`, so the name is the text "TWD".
  - `<nav aria-label="Tour">` holds:
    - the arrow links, with `aria-label` set to "Previous: {title}" and "Next: {title}"; disabled arrows are `aria-hidden` spans
    - a `<details>` whose summary reads "Chapter N of 6" (or "Tour" on chapter 0) and the title
    - an `<ol>` of chapter links named "{number} {title}"
  - Last comes the external link "Docs ↗".
- **Shop header** (`ShopApp.vue`): text "Bean & Leaf" (🌿 `aria-hidden`); "Coffee / Tea / Gifts" are `aria-hidden` spans, not links; cart badge `<span aria-label="Cart: N item(s)">`. No shop nav links or buttons.
- **Repeated controls** (`aria-label` patterns): "Add {name} to cart" (visible "Add"), "{name} is sold out" (visible "Sold out"), "One less {name}", "One more {name}", "Remove {name}", "{name} quantity" (span), "Delete {title}" (TodoBoard).
- **Other names**: the shop tour card toggle is "Expand the tour" / "Collapse the tour". Videos take `aria-label` from the `label` prop.
- **Labelled lists**: "Products", "Cart items", "Your list", "Todos", "Todos from the API".
- **Labelled regions**: asides "Tour" (TourCard) and "TWD tour" (shop card); sections "The app under test", "Terminal", "Cart" (`aria-labelledby`).
- **Form labels**: visible `<label for>` on "New item", "New todo", "Name", "Email" and "Card number". "Discount code" uses a `.visually-hidden` label. The TodoBoard checkbox is wrapped in a `<label>`.
- **Announcements**: `role="status"` for loading, "N items left", OrderDone; `role="alert"` for load errors, BackendMissing, discount/order/save errors; `aria-live="polite"` on `.tour-live` in both tour cards; done steps get a visually hidden "Done: ".
- **Form errors**: a `p.demo-inline-error` appears after the input with no `aria-describedby` or `aria-invalid`. Checkout uses `novalidate` and custom validation.
- **Landmarks and headings**:
  - Tour: `header` > `nav`, `main` > `article`, one h1 per chapter, h2 for sections.
  - Shop: `header`, `main` (h1 "Fresh beans and loose leaf, shipped weekly.", h3 "Cart"/"Checkout"/"Order … is on its way"), `aside`.
- Tests query these names (`findByRole`, `findByLabelText`): renaming one breaks a test.

## 7. Content

- **Vocabulary**: "test", "sidebar", "Run All" / "Run Filtered", "Filter tests", "Speed" (Off / "Slow (300ms)"), "chapter", "tour", "mock", "backend". In the shop: "Cart", "Checkout", "Discount code", "Apply", "Subtotal", "Total", "Place order", "Order", "Sold out".
- **Tone**: short, second person, sentence case, contractions. Errors say what happened and what to do: "Couldn't load the shop." + "Try again"; "That code doesn't exist."; "Payment declined: {msg}. Your cart is still here."; "Enter a 16-digit card number."; "That email doesn't look right."
- CTAs end in "→", external links in "↗"; "…" for progress, "·" as separator.
- **Numbers**:
  - Money is stored as integer cents and shown with `Intl.NumberFormat('en-IE', {currency:'EUR'})`, e.g. "€14.00".
  - Durations are seconds with one decimal, e.g. "in 0.2s".
  - Counts are pluralised: "1 item" / "2 items".
- **Dates**: unknown (none shown).
- **Language**: English only (`<html lang="en">`).

## 8. Screens

- `/`: Chapter 0 "Meet TWD". The hero has "Start the tour →", the install command and 4 fact cards.
- `/first-test`: Chapter 1 "Your first test". HelloList demo ("hello" into a list).
- `/speed`: Chapter 2 "Too fast?". TodoBoard demo with add, tick and delete; the reader sets Speed to Slow.
- `/automate`: Chapter 3 "Automate it". The terminal replays `pnpm test:ci`, followed by feature rows for CLI, recording and relay.
- `/mocking`: Chapter 4 "No backend? Mock it". TodoApi demo with mocked list, empty, 500, slow and POST responses.
- `/real-app`: Chapter 5 "Test a real app". Bean & Leaf intro card plus the test groups.
- `/shop`: Bean & Leaf shop (standalone). Catalog, cart, discount, checkout, order done, plus the floating tour card.
- `/ship`: Chapter 6 "Run it all". Run All, proof links, twd-ai skills, install finale.
- `/:pathMatch(.*)*`: "Nothing here." The message is delayed 300ms.

## 9. Where things are

- **Router**: `src/router.ts` (lazy views). Shell: `src/App.vue` (switches on `meta.standalone`). Chapter list: `src/chapters.ts`.
- **Pages**: `src/views/*View.vue`. Each page composes shared components directly (TourCard, StageFrame, TestSource and a demo widget) and follows the sidebar through `src/composables/useTwd*.ts` and `useSpotlight.ts`.
- **Shared components**: `src/components/` (ChapterNav, TourCard, StageFrame, TestSource, TerminalReplay, FeatureVideo, BackendMissing, and the demos HelloList, TodoBoard and TodoApi).
- **Shop feature**: `src/components/shop/` (ShopApp, ProductGrid, CartPanel, CheckoutForm, OrderDone, ShopTour), with its Pinia store in `src/stores/shop.ts` (state, totals, `formatPrice`).
- **API**: `src/api/http.ts` (`request`, `NoBackendError`, `HttpError`), `src/api/shop.ts` (`/api/products`, `/api/discounts`, `/api/orders`) and `src/api/todos.ts` (`/api/todos`).
- **Tokens/styles**: one global file, `src/assets/main.css`; components have no `<style>` blocks.
- **Tests**:
  - `src/twd-tests/0N-*.twd.test.ts`, loaded eagerly by `src/twd.ts`; headless via `twd-cli` (`twd.config.json`).
  - They use `twd.mockRequest`, `twd.visit`, `screenDom` and `userEvent`; helpers are per file (`openShop`, `addToCart`, `fillCheckout` in `05-shop`).
- **Mocks**: `src/twd-tests/mocks/shop.ts` (4 products: Coffee beans €14.00/5, Matcha tin €22.50/2, Teapot €39.00/0 sold out, Croissant box €9.90/10); todo fixtures inline in `04-mocking.twd.test.ts`; service worker `public/mock-sw.js`.

## 10. Known gaps

- Checkout field errors are not tied to their inputs: no `aria-describedby`, no `aria-invalid`, no `role="alert"`, and focus does not move to the first error.
- The shop cart badge puts `aria-label` on a plain `<span>` with no role, so screen readers may ignore it. The shop header has no `<nav>`, and its category "links" are fake.
- Shop headings skip from h1 to h3 (Cart, Checkout, Order done have no h2).
- Several landmarks share the name "Tour": the nav, each TourCard aside, and the shop card's aside ("TWD tour").
- TourCard renders step text with `v-html`.
- Shop colours are a scoped second palette, and `.real-app-card` hard-codes the same hex values instead of using the variables.
- The cart lines' borders use the tour `--line` colour, not `--shop-line`.
- No dark mode, modals, toasts, tables or date formatting.

## 11. Constraints

- Use the tokens and existing classes (`.button primary|small|large|wide`, `.icon-button`, `.tour-message is-*`, `.demo-*`, `.field`); styles go in `src/assets/main.css`.
- Vue 3 `<script setup lang="ts">`, Vue Router 5 and Pinia. No Tailwind or UI library is installed.
- Tour screens sit inside the shell (header plus 1180px main). A screen outside the tour needs `meta: { standalone: true }`.
- Data comes only through `src/api/*` and `request()`. There is no backend, so every screen must handle loading, the `no-backend` state (render `BackendMissing`), error with "Try again", and empty.
- Every control needs an accessible name that a test can query with `findByRole` or `findByLabelText`. Repeated controls follow "{Verb} {item name}". Messages use `role="status"` or `role="alert"`.
- Layouts must survive the left TWD sidebar pushing `<html>` right, and the fixed shop tour card.
- Money is in cents, formatted en-IE EUR. Copy is English, sentence case and second person.
- Respect `prefers-reduced-motion`. Keep the teal `:focus-visible` outline.
