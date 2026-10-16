<script setup lang="ts">
import { ref } from 'vue'
import { formatPrice, useShopStore } from '@/stores/shop'

const shop = useShopStore()
const code = ref('')
</script>

<template>
  <section class="cart" aria-labelledby="cart-title">
    <h3 id="cart-title">Cart</h3>
    <p v-if="!shop.lines.length" class="demo-empty">Your cart is empty.</p>
    <template v-else>
      <ul class="cart-lines" aria-label="Cart items">
        <li v-for="line in shop.lines" :key="line.product.id">
          <span class="cart-line-name">{{ line.product.name }}</span>
          <span class="qty">
            <button
              type="button"
              class="icon-button"
              :aria-label="`One less ${line.product.name}`"
              @click="shop.setQuantity(line.product, line.quantity - 1)"
            >
              −
            </button>
            <span :aria-label="`${line.product.name} quantity`">{{ line.quantity }}</span>
            <button
              type="button"
              class="icon-button"
              :aria-label="`One more ${line.product.name}`"
              :disabled="line.quantity >= line.product.stock"
              @click="shop.setQuantity(line.product, line.quantity + 1)"
            >
              +
            </button>
          </span>
          <span class="cart-line-total">{{ formatPrice(line.total) }}</span>
          <button
            type="button"
            class="icon-button"
            :aria-label="`Remove ${line.product.name}`"
            @click="shop.setQuantity(line.product, 0)"
          >
            ✕
          </button>
          <p v-if="line.quantity >= line.product.stock" class="cart-note">
            Only {{ line.product.stock }} in stock
          </p>
        </li>
      </ul>

      <form class="discount" @submit.prevent="shop.applyDiscount(code.trim())">
        <label for="discount-code" class="visually-hidden">Discount code</label>
        <input id="discount-code" v-model="code" autocomplete="off" placeholder="Discount code" />
        <button type="submit" class="button small" :disabled="!code.trim()">Apply</button>
      </form>
      <p v-if="shop.discountError" class="demo-inline-error" role="alert">
        {{ shop.discountError }}
      </p>

      <dl class="totals">
        <div>
          <dt>Subtotal</dt>
          <dd data-testid="subtotal">{{ formatPrice(shop.subtotal) }}</dd>
        </div>
        <div v-if="shop.discount">
          <dt>{{ shop.discount.code }} (−{{ shop.discount.percent }}%)</dt>
          <dd>−{{ formatPrice(shop.savings) }}</dd>
        </div>
        <div class="totals-total">
          <dt>Total</dt>
          <dd data-testid="total">{{ formatPrice(shop.total) }}</dd>
        </div>
      </dl>
      <button type="button" class="button primary wide" @click="shop.step = 'checkout'">
        Checkout
      </button>
    </template>
  </section>
</template>
