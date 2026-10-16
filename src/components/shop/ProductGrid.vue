<script setup lang="ts">
import { formatPrice, useShopStore } from '@/stores/shop'

const shop = useShopStore()
</script>

<template>
  <ul class="products" aria-label="Products">
    <li v-for="product in shop.products" :key="product.id" class="product">
      <span class="product-emoji" aria-hidden="true">{{ product.emoji }}</span>
      <span class="product-name">{{ product.name }}</span>
      <span class="product-price">{{ formatPrice(product.price) }}</span>
      <button
        v-if="product.stock === 0"
        type="button"
        class="button small"
        disabled
        :aria-label="`${product.name} is sold out`"
      >
        Sold out
      </button>
      <button
        v-else
        type="button"
        class="button primary small"
        :aria-label="`Add ${product.name} to cart`"
        :disabled="shop.quantityOf(product.id) >= product.stock"
        @click="shop.setQuantity(product, shop.quantityOf(product.id) + 1)"
      >
        Add
      </button>
    </li>
  </ul>
</template>
