<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import TestSource from '@/components/TestSource.vue'
import { chapterAfter } from '@/chapters'
import { useShopRun } from '@/composables/useShopRun'
import source from '@/twd-tests/05-shop.twd.test.ts?raw'

const { shopRun } = useShopRun()
const passed = computed(() => !!shopRun.value && shopRun.value.failed === 0)
const next = chapterAfter('/real-app')!

const groups = [
  {
    name: 'Catalog',
    tests: ['every product and its price', 'sold-out products disabled', 'the catalog failing'],
  },
  {
    name: 'Cart',
    tests: ['the cart badge', 'quantities and totals', 'the stock limit', 'removing a product'],
  },
  { name: 'Discounts', tests: ['a valid code', 'a code that does not exist'] },
  {
    name: 'Checkout',
    tests: ['missing details', 'a bad email', 'a placed order', 'a declined card'],
  },
]
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <p class="eyebrow">Chapter 5</p>
      <h1>Test a real app</h1>
      <p class="lede">
        Everything so far was built for the tour. <strong>Bean &amp; Leaf</strong> is a small shop
        that could be anyone's app: a catalog, a cart, discount codes and a checkout that can be
        declined. It has its own tests, and like the rest of this site, no backend.
      </p>
    </header>

    <div class="real-app">
      <div class="real-app-card">
        <p class="real-app-url" aria-hidden="true">/shop</p>
        <h2><span aria-hidden="true">🌿</span> Bean &amp; Leaf</h2>
        <p>
          It opens as a site of its own, without this tour's menu. The sidebar comes with you, and
          so does a small tour card to guide you through it.
        </p>
        <RouterLink v-if="!passed" to="/shop" class="button primary large">
          Open Bean &amp; Leaf →
        </RouterLink>
        <template v-else>
          <p class="tour-message is-success">
            <strong>Done: the shop passed all its tests.</strong> One thing left.
          </p>
          <RouterLink :to="next.path" class="button primary large">
            Chapter {{ next.number }}: {{ next.title }} →
          </RouterLink>
        </template>
      </div>

      <div class="real-app-tests">
        <h2>What its tests check</h2>
        <ul class="test-groups">
          <li v-for="group in groups" :key="group.name">
            <strong>{{ group.name }}</strong>
            <span>{{ group.tests.join(' · ') }}</span>
          </li>
        </ul>
        <TestSource :source="source" file="05-shop.twd.test.ts" />
      </div>
    </div>
  </article>
</template>
