<script setup lang="ts">
import { onMounted } from 'vue'
import { useShopStore } from '@/stores/shop'
import BackendMissing from '../BackendMissing.vue'
import ProductGrid from './ProductGrid.vue'
import CartPanel from './CartPanel.vue'
import CheckoutForm from './CheckoutForm.vue'
import OrderDone from './OrderDone.vue'

const shop = useShopStore()

// A fresh shop on every visit, as a real page load would give
onMounted(() => {
  shop.$reset()
  void shop.load()
})
</script>

<template>
  <div class="shop">
    <header class="shop-head">
      <span class="shop-name">Bean &amp; Leaf</span>
      <span
        class="shop-badge"
        :aria-label="`Cart: ${shop.itemCount} ${shop.itemCount === 1 ? 'item' : 'items'}`"
      >
        🛒 {{ shop.itemCount }}
      </span>
    </header>

    <p v-if="shop.catalog === 'loading'" class="demo-loading" role="status">Loading the shop…</p>
    <BackendMissing v-else-if="shop.catalog === 'no-backend'" />
    <div v-else-if="shop.catalog === 'error'" class="demo-error" role="alert">
      <p>Couldn't load the shop.</p>
      <button type="button" class="button primary" @click="shop.load()">Try again</button>
    </div>

    <OrderDone v-else-if="shop.step === 'done'" />
    <CheckoutForm v-else-if="shop.step === 'checkout'" />
    <div v-else class="shop-browse">
      <ProductGrid />
      <CartPanel />
    </div>
  </div>
</template>
