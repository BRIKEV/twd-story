import { onUnmounted, toValue, watchEffect, type MaybeRefOrGetter } from 'vue'

const ATTRIBUTE = 'data-story-spotlight'

/**
 * Pulses an element inside the TWD sidebar to show the reader where to click.
 *
 * The selector is re-applied on an interval because the sidebar renders after
 * the page and re-renders on its own schedule. A data attribute is used rather
 * than a class so the sidebar's own className updates never wipe it.
 */
export function useSpotlight(selector: MaybeRefOrGetter<string | null>) {
  let timer: ReturnType<typeof setInterval> | undefined

  const clear = () => {
    document.querySelectorAll(`[${ATTRIBUTE}]`).forEach((el) => el.removeAttribute(ATTRIBUTE))
  }

  watchEffect(() => {
    clearInterval(timer)
    clear()
    const current = toValue(selector)
    if (!current) return
    const apply = () => {
      const target = document.querySelector(`#twd-sidebar-root ${current}`)
      if (target && !target.hasAttribute(ATTRIBUTE)) {
        clear()
        target.setAttribute(ATTRIBUTE, '')
        // The test list outgrows the sidebar by chapter 4; bring the target into view
        target.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
    apply()
    timer = setInterval(apply, 300)
  })

  onUnmounted(() => {
    clearInterval(timer)
    clear()
  })
}

/** The ▶ button the sidebar renders next to a test, by its accessible name. */
export const runButton = (testName: string) =>
  `button[aria-label=${JSON.stringify(`Run ${testName} test`)}]`
