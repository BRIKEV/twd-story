import { computed } from 'vue'
import { testIdsIn, useTwdSuite } from './useTwdSuite'

export const SHOP_SUITE = 'Chapter 5 · Bean & Leaf shop'

/** Whether the reader has run every shop test in one go, and how it went. */
export function useShopRun() {
  const { suite, lastRun } = useTwdSuite()

  // Re-read on every tick: test modules finish loading after the app mounts
  const shopIds = computed(() => (suite.value.total ? testIdsIn(SHOP_SUITE) : []))

  const shopRun = computed(() => {
    const run = lastRun.value
    if (!run || !shopIds.value.length) return null
    return shopIds.value.every((id) => run.ids.has(id)) ? run : null
  })

  return { suite, lastRun, shopIds, shopRun }
}
