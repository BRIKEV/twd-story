import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { HttpError, NoBackendError } from '@/api/http'
import {
  checkDiscount,
  fetchProducts,
  placeOrder,
  type Discount,
  type Order,
  type Product,
} from '@/api/shop'

export type CatalogState = 'loading' | 'ready' | 'no-backend' | 'error'
export type Step = 'browse' | 'checkout' | 'done'

export interface CheckoutDetails {
  name: string
  email: string
  card: string
}

export const useShopStore = defineStore('shop', () => {
  const products = ref<Product[]>([])
  const catalog = ref<CatalogState>('loading')
  /** productId → quantity, in the order products were added */
  const cart = ref<Record<string, number>>({})
  const discount = ref<Discount | null>(null)
  const discountError = ref<string | null>(null)
  const step = ref<Step>('browse')
  const order = ref<Order | null>(null)
  const orderError = ref<string | null>(null)
  const placing = ref(false)

  const lines = computed(() =>
    Object.entries(cart.value).flatMap(([id, quantity]) => {
      const product = products.value.find((p) => p.id === id)
      return product ? [{ product, quantity, total: product.price * quantity }] : []
    }),
  )
  const itemCount = computed(() => lines.value.reduce((sum, line) => sum + line.quantity, 0))
  const subtotal = computed(() => lines.value.reduce((sum, line) => sum + line.total, 0))
  const savings = computed(() =>
    discount.value ? Math.round((subtotal.value * discount.value.percent) / 100) : 0,
  )
  const total = computed(() => subtotal.value - savings.value)

  async function load() {
    catalog.value = 'loading'
    try {
      products.value = await fetchProducts()
      catalog.value = 'ready'
    } catch (error) {
      catalog.value = error instanceof NoBackendError ? 'no-backend' : 'error'
    }
  }

  function quantityOf(id: string) {
    return cart.value[id] ?? 0
  }

  function setQuantity(product: Product, quantity: number) {
    const next = Math.min(Math.max(quantity, 0), product.stock)
    if (next === 0) {
      const { [product.id]: _removed, ...rest } = cart.value
      cart.value = rest
    } else {
      cart.value = { ...cart.value, [product.id]: next }
    }
  }

  async function applyDiscount(code: string) {
    discountError.value = null
    try {
      discount.value = await checkDiscount(code)
    } catch (error) {
      discount.value = null
      discountError.value =
        error instanceof HttpError && error.status === 404
          ? "That code doesn't exist."
          : "Couldn't check that code. Try again."
    }
  }

  async function checkout(details: CheckoutDetails) {
    placing.value = true
    orderError.value = null
    try {
      order.value = await placeOrder({
        name: details.name,
        email: details.email,
        items: lines.value.map((line) => ({ productId: line.product.id, quantity: line.quantity })),
        discountCode: discount.value?.code ?? null,
      })
      cart.value = {}
      discount.value = null
      step.value = 'done'
    } catch (error) {
      const message =
        error instanceof HttpError &&
        typeof error.body === 'object' &&
        error.body !== null &&
        'message' in error.body
          ? String(error.body.message)
          : null
      orderError.value =
        error instanceof HttpError && error.status === 402
          ? `Payment declined${message ? `: ${message}` : ''}. Your cart is still here.`
          : 'Something went wrong placing your order. Try again.'
    } finally {
      placing.value = false
    }
  }

  function $reset() {
    products.value = []
    catalog.value = 'loading'
    cart.value = {}
    discount.value = null
    discountError.value = null
    step.value = 'browse'
    order.value = null
    orderError.value = null
    placing.value = false
  }

  return {
    products,
    catalog,
    cart,
    discount,
    discountError,
    step,
    order,
    orderError,
    placing,
    lines,
    itemCount,
    subtotal,
    savings,
    total,
    load,
    quantityOf,
    setQuantity,
    applyDiscount,
    checkout,
    $reset,
  }
})

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
