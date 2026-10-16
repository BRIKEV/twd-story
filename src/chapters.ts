export interface Chapter {
  number: number
  path: string
  title: string
  /** Chapters not built yet still show in the nav, so the arc is visible. */
  ready: boolean
}

export const chapters: Chapter[] = [
  { number: 0, path: '/', title: 'Meet TWD', ready: true },
  { number: 1, path: '/first-test', title: 'Your first test', ready: true },
  { number: 2, path: '/speed', title: 'Too fast?', ready: true },
  { number: 3, path: '/automate', title: 'Automate it', ready: true },
  { number: 4, path: '/mocking', title: 'No backend? Mock it', ready: true },
  { number: 5, path: '/shop', title: 'Run everything', ready: true },
  { number: 6, path: '/ship', title: 'Proof & tooling', ready: true },
]

export const chapterAfter = (path: string) => {
  const index = chapters.findIndex((chapter) => chapter.path === path)
  return chapters[index + 1]
}
