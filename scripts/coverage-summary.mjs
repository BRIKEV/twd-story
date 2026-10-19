// Turns nyc's json-summary into a short Markdown section for the GitHub job
// summary: one headline table, then the per-file numbers folded away.
//
// Usage: node scripts/coverage-summary.mjs [coverage-summary.json] [run.json]
import { existsSync, readFileSync } from 'node:fs'
import { relative } from 'node:path'

const [summaryPath = 'coverage/coverage-summary.json', runPath = '.twd/report/run.json'] =
  process.argv.slice(2)

if (!existsSync(summaryPath)) {
  console.log('### Code coverage\n\nNo coverage data: the run produced none.')
  process.exit(0)
}

const summary = JSON.parse(readFileSync(summaryPath, 'utf8'))
const run = existsSync(runPath) ? JSON.parse(readFileSync(runPath, 'utf8')) : null
const tests = run ? run.summary.passed + run.summary.failed : null

const METRICS = [
  ['lines', 'Lines'],
  ['statements', 'Statements'],
  ['functions', 'Functions'],
  ['branches', 'Branches'],
]

const percent = (metric) => (metric.total === 0 ? '—' : `${metric.pct.toFixed(1)}%`)
const cell = (metric) => `${percent(metric)} (${metric.covered}/${metric.total})`
const icon = (pct) => (pct >= 90 ? '🟢' : pct >= 70 ? '🟡' : '🔴')

const { total, ...files } = summary
const lines = []

lines.push('### Code coverage', '')
lines.push(
  `${icon(total.lines.pct)} **${percent(total.lines)} of lines** ran during ` +
    `${tests === null ? 'the TWD tests' : `the ${tests} TWD tests`}, measured in the ` +
    'browser by istanbul while twd-cli drove the app.',
  '',
)
lines.push(`| ${METRICS.map(([, label]) => label).join(' | ')} |`)
lines.push(`| ${METRICS.map(() => '---').join(' | ')} |`)
lines.push(`| ${METRICS.map(([key]) => cell(total[key])).join(' | ')} |`, '')

const rows = Object.entries(files)
  .map(([file, metrics]) => [relative(process.cwd(), file), metrics])
  .sort(([a], [b]) => a.localeCompare(b))

lines.push('<details><summary>By file</summary>', '')
lines.push(`| File | ${METRICS.map(([, label]) => label).join(' | ')} |`)
lines.push(`| --- | ${METRICS.map(() => '---:').join(' | ')} |`)
for (const [file, metrics] of rows) {
  lines.push(`| \`${file}\` | ${METRICS.map(([key]) => percent(metrics[key])).join(' | ')} |`)
}
lines.push('', '</details>')

console.log(lines.join('\n'))
