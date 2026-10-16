import { request } from './http'

export interface Product {
  id: string
  name: string
  emoji: string
  price: number
  stock: number
}

export interface Discount {
  code: string
  percent: number
}

export interface OrderRequest {
  name: string
  email: string
  items: { productId: string; quantity: number }[]
  discountCode: string | null
}

export interface Order {
  id: string
  total: number
}

export const fetchProducts = () => request<Product[]>('/api/products')

export const checkDiscount = (code: string) =>
  request<Discount>('/api/discounts', { method: 'POST', body: JSON.stringify({ code }) })

export const placeOrder = (order: OrderRequest) =>
  request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(order) })
