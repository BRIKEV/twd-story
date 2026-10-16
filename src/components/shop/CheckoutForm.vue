<script setup lang="ts">
import { reactive, ref } from 'vue'
import { formatPrice, useShopStore } from '@/stores/shop'

const shop = useShopStore()
const details = reactive({ name: '', email: '', card: '' })
const errors = ref<Partial<Record<keyof typeof details, string>>>({})

function validate() {
  const next: typeof errors.value = {}
  if (!details.name.trim()) next.name = 'Enter your name.'
  if (!details.email.trim()) next.email = 'Enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))
    next.email = "That email doesn't look right."
  if (!/^\d{16}$/.test(details.card.replace(/\s/g, ''))) next.card = 'Enter a 16-digit card number.'
  errors.value = next
  return Object.keys(next).length === 0
}

function submit() {
  if (!validate()) return
  void shop.checkout({
    name: details.name.trim(),
    email: details.email.trim(),
    card: details.card.replace(/\s/g, ''),
  })
}
</script>

<template>
  <form class="checkout" novalidate @submit.prevent="submit">
    <h3>Checkout</h3>
    <p class="checkout-total">
      {{ shop.itemCount }} {{ shop.itemCount === 1 ? 'item' : 'items' }} ·
      <strong>{{ formatPrice(shop.total) }}</strong>
    </p>

    <div class="field">
      <label for="checkout-name">Name</label>
      <input id="checkout-name" v-model="details.name" autocomplete="name" />
      <p v-if="errors.name" class="demo-inline-error">{{ errors.name }}</p>
    </div>
    <div class="field">
      <label for="checkout-email">Email</label>
      <input id="checkout-email" v-model="details.email" type="email" autocomplete="email" />
      <p v-if="errors.email" class="demo-inline-error">{{ errors.email }}</p>
    </div>
    <div class="field">
      <label for="checkout-card">Card number</label>
      <input id="checkout-card" v-model="details.card" inputmode="numeric" autocomplete="off" />
      <p v-if="errors.card" class="demo-inline-error">{{ errors.card }}</p>
    </div>

    <p v-if="shop.orderError" class="demo-inline-error" role="alert">{{ shop.orderError }}</p>

    <div class="checkout-actions">
      <button type="button" class="button" @click="shop.step = 'browse'">Back to cart</button>
      <button type="submit" class="button primary" :disabled="shop.placing">
        {{ shop.placing ? 'Placing order…' : 'Place order' }}
      </button>
    </div>
  </form>
</template>
