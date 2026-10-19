import { readonly, ref } from 'vue'

/**
 * The tour needs the sidebar and the page side by side, so it only runs on
 * screens at least this wide. twd-cli's default viewport (1280) clears it.
 */
const QUERY = '(min-width: 1024px)'

const media = window.matchMedia(QUERY)
const wide = ref(media.matches)
media.addEventListener('change', (event) => {
  wide.value = event.matches
})

export const useWideScreen = () => readonly(wide)

/** Runs `callback` once, as soon as the screen is wide enough (maybe right away). */
export function whenWide(callback: () => void) {
  if (media.matches) return callback()
  const onChange = (event: MediaQueryListEvent) => {
    if (!event.matches) return
    media.removeEventListener('change', onChange)
    callback()
  }
  media.addEventListener('change', onChange)
}
