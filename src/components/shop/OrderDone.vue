<script setup lang="ts">
import { formatPrice, useShopStore } from '@/stores/shop'

const shop = useShopStore()
</script>

<template>
  <section v-if="shop.order" class="order-done" role="status">
    <p class="order-done-icon" aria-hidden="true">✓</p>
    <h3>Order {{ shop.order.id }} is on its way</h3>
    <p>Charged {{ formatPrice(shop.order.total) }}. A receipt is heading to your inbox.</p>
    <button type="button" class="button" @click="shop.step = 'browse'">Keep shopping</button>
  </section>
</template>
