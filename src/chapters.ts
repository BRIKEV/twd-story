export interface Chapter {
  number: number
  path: string
  title: string
}

export const chapters: Chapter[] = [
  { number: 0, path: '/', title: 'Meet TWD' },
  { number: 1, path: '/first-test', title: 'Your first test' },
  { number: 2, path: '/speed', title: 'Too fast?' },
  { number: 3, path: '/automate', title: 'Automate it' },
  { number: 4, path: '/mocking', title: 'No backend? Mock it' },
  { number: 5, path: '/real-app', title: 'Test a real app' },
  { number: 6, path: '/ship', title: 'Run it all' },
]

export const LAST_CHAPTER = chapters.length - 1

export const chapterAt = (path: string) => chapters.find((chapter) => chapter.path === path)

export const chapterAfter = (path: string) => {
  const index = chapters.findIndex((chapter) => chapter.path === path)
  return chapters[index + 1]
}

export const chapterBefore = (path: string) => {
  const index = chapters.findIndex((chapter) => chapter.path === path)
  return index > 0 ? chapters[index - 1] : undefined
}
