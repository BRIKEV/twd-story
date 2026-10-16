# twd-story

A live, guided tour of [TWD](https://twd.dev). The TWD sidebar ships to
production on purpose: readers press ▶ on real tests and watch them drive the
page, and each chapter reacts to the run and leads to the next.

## Commands

```bash
vp install
pnpm dev        # dev server, sidebar included
pnpm build      # type-check + production build (sidebar and tests included)
pnpm preview    # serve dist/
pnpm dev:ci     # dev server with coverage instrumentation
pnpm test:ci    # run every chapter's tests headless (needs dev:ci running)
```

## How TWD runs in production here

- No `twd()` Vite plugin: it only applies to `vp dev`. `src/main.ts` calls
  `initTWD` from `twd-js/bundled` unconditionally, following the
  [manual setup](https://twd.dev/getting-started#manual-setup-for-non-vite-projects).
- No `removeMockServiceWorker()`: the mocking chapters need `mock-sw.js` in
  `dist/`. `pnpm sw` copies it into `public/` before every dev run and build.
- Host at a domain root (e.g. a Cloudflare Pages subdomain). `twd.visit()` and
  the service worker URL are absolute, so a subpath deploy would break both.
  The host must serve `index.html` for unknown paths (SPA fallback).

## How chapters follow the sidebar

TWD exposes no run events, but its runner state lives on
`window.__TWD_STATE__`, and the composables poll it on animation frames:

- `useTwdTest(name)` follows one test by name (chapters 1–4).
- `useTwdSuite()` follows every test, for the Run All in chapter 5. It runs one
  loop for the life of the page, started in `main.ts`, because Run All spends
  most of its time on other chapters while the shop page is not mounted.
- `useTwdPace()` reads the Speed selector.
- `useSpotlight()` pulses, and scrolls to, the sidebar element the reader
  should click next.

Run state lives at module level, not in components: `twd.visit()` remounts the
page mid-run, so component state would lose the start of the run.

A test name is part of the copy: rename a test and update the chapter that
names it.

## No backend, on purpose

`src/api/http.ts` turns a request nobody mocked (the static host's HTML
fallback or a 404 page) into `NoBackendError`, and the demos show "No backend
answered… run a test". Mocked responses are always JSON, so a mocked 500, 404
or 402 is treated as the server talking.

## Chapters

| #   | Route         | What the reader does                                                                  |
| --- | ------------- | ------------------------------------------------------------------------------------- |
| 0   | `/`           | Meets the sidebar                                                                     |
| 1   | `/first-test` | Runs one test that types "hello" into a list                                          |
| 2   | `/speed`      | Sets Speed to Slow and watches a longer test                                          |
| 3   | `/automate`   | Replays chapters 1–2 at full speed; then twd-cli, recording, relay                    |
| 4   | `/mocking`    | Runs mocked API scenarios: list, empty, 500, recovery, slow, POST (3 unlock the next) |
| 5   | `/shop`       | Presses Run All: every chapter plus 13 shop tests                                     |
| 6   | `/ship`       | Proof (CI, recordings, test files), twd-ai skills, install                            |

The links in chapter 6 live in `src/links.ts` and assume the repo is
`BRIKEV/twd-story`. The chapter 3 terminal shows real `pnpm test:ci` output;
update it when the test count changes.

## CI

- `twd-tests.yml`: `vp check`, then every test headless with coverage; the
  report and the coverage table go to the job summary.
- `twd-record.yml`: label a PR `record` to get a video of the tests it added.
