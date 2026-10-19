// Everything the last chapter points at, in one place. The repo is assumed to
// live at BRIKEV/twd-story; change REPO if it ends up elsewhere.
const REPO = 'https://github.com/BRIKEV/twd-story'

export const links = {
  repo: REPO,
  tests: `${REPO}/tree/main/src/twd-tests`,
  ciRuns: `${REPO}/actions/workflows/twd-tests.yml`,
  recordWorkflow: `${REPO}/blob/main/.github/workflows/twd-record.yml`,
  // The record workflow drops the label once it has recorded, so a label search
  // would come back empty: link the PR that was recorded instead.
  recordedPr: `${REPO}/pull/1`,
  docs: 'https://twd.dev',
  docsMocking: 'https://twd.dev/api-mocking',
  docsRecording: 'https://twd.dev/recording',
  docsCi: 'https://twd.dev/ci-execution',
  docsCoverage: 'https://twd.dev/coverage',
  docsRelay: 'https://twd.dev/twd-relay',
  docsSkills: 'https://twd.dev/claude-plugin',
  twdRepo: 'https://github.com/BRIKEV/twd',
  twdAi: 'https://github.com/BRIKEV/twd-ai',
}
