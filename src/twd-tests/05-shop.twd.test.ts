import { twd, userEvent, screenDom, expect } from 'twd-js'
import { describe, it, beforeEach, afterEach } from 'twd-js/runner'
import { products } from './mocks/shop'

const openShop = async () => {
  await twd.mockRequest('getProducts', { method: 'GET', url: '/api/products', response: products })
  await twd.visit('/shop')
  await screenDom.findByRole('list', { name: 'Products' })
}

const addToCart = async (name: string) => {
  await userEvent.click(await screenDom.findByRole('button', { name: `Add ${name} to cart` }))
}

const goToCheckout = async () => {
  await openShop()
  await addToCart('Coffee beans')
  await addToCart('Coffee beans')
  await userEvent.click(await screenDom.findByRole('button', { name: 'Checkout' }))
}

const fillCheckout = async (details: { name: string; email: string; card: string }) => {
  const user = userEvent.setup()
  await user.type(await screenDom.findByLabelText('Name'), details.name)
  await user.type(await screenDom.findByLabelText('Email'), details.email)
  await user.type(await screenDom.findByLabelText('Card number'), details.card)
  await user.click(await screenDom.findByRole('button', { name: 'Place order' }))
}

describe('Chapter 5 · The shop', () => {
  beforeEach(() => {
    twd.clearRequestMockRules()
  })

  afterEach(() => {
    twd.clearRequestMockRules()
  })

  describe('Catalog', () => {
    it('lists every product with its price', async () => {
      await openShop()

      const catalog = await screenDom.findByRole('list', { name: 'Products' })
      twd.should(catalog, 'contain.text', 'Coffee beans')
      twd.should(catalog, 'contain.text', '€14.00')
      twd.should(catalog, 'contain.text', 'Croissant box')
      twd.should(catalog, 'contain.text', '€9.90')
    })

    it('marks sold-out products and disables them', async () => {
      await openShop()

      twd.should(
        await screenDom.findByRole('button', { name: 'Teapot is sold out' }),
        'be.disabled',
      )
    })

    it("shows an error when the catalog can't load", async () => {
      await twd.mockRequest('getProducts', {
        method: 'GET',
        url: '/api/products',
        response: { message: 'Database unavailable' },
        status: 503,
      })
      await twd.visit('/shop')

      await screenDom.findByText("Couldn't load the shop.")
      await screenDom.findByRole('button', { name: 'Try again' })
    })
  })

  describe('Cart', () => {
    it('adds a product and counts it in the cart badge', async () => {
      await openShop()
      await addToCart('Coffee beans')

      await screenDom.findByLabelText('Cart: 1 item')
      twd.should(await screenDom.findByTestId('subtotal'), 'have.text', '€14.00')
    })

    it('updates the total when the quantity changes', async () => {
      await openShop()
      await addToCart('Coffee beans')
      const more = await screenDom.findByRole('button', { name: 'One more Coffee beans' })
      await userEvent.click(more)
      await userEvent.click(more)
      twd.should(await screenDom.findByTestId('total'), 'have.text', '€42.00')

      await userEvent.click(await screenDom.findByRole('button', { name: 'One less Coffee beans' }))
      twd.should(await screenDom.findByTestId('total'), 'have.text', '€28.00')
    })

    it('stops at the stock limit', async () => {
      await openShop()
      await addToCart('Matcha tin')
      await userEvent.click(await screenDom.findByRole('button', { name: 'One more Matcha tin' }))

      twd.should(await screenDom.findByLabelText('Matcha tin quantity'), 'have.text', '2')
      twd.should(
        await screenDom.findByRole('button', { name: 'One more Matcha tin' }),
        'be.disabled',
      )
      await screenDom.findByText('Only 2 in stock')
    })

    it('removes a product', async () => {
      await openShop()
      await addToCart('Croissant box')
      await userEvent.click(await screenDom.findByRole('button', { name: 'Remove Croissant box' }))

      await screenDom.findByText('Your cart is empty.')
    })
  })

  describe('Discounts', () => {
    it('applies a valid code to the total', async () => {
      await twd.mockRequest('checkDiscount', {
        method: 'POST',
        url: '/api/discounts',
        response: { code: 'TWD10', percent: 10 },
      })
      await openShop()
      await addToCart('Coffee beans')

      const user = userEvent.setup()
      await user.type(await screenDom.findByLabelText('Discount code'), 'TWD10')
      await user.click(await screenDom.findByRole('button', { name: 'Apply' }))

      const rule = await twd.waitForRequest('checkDiscount')
      expect(rule.request).to.deep.equal({ code: 'TWD10' })
      await screenDom.findByText('TWD10 (−10%)')
      twd.should(await screenDom.findByTestId('total'), 'have.text', '€12.60')
    })

    it('rejects a code that does not exist', async () => {
      await twd.mockRequest('checkDiscount', {
        method: 'POST',
        url: '/api/discounts',
        response: { message: 'Unknown code' },
        status: 404,
      })
      await openShop()
      await addToCart('Coffee beans')

      const user = userEvent.setup()
      await user.type(await screenDom.findByLabelText('Discount code'), 'FREESTUFF')
      await user.click(await screenDom.findByRole('button', { name: 'Apply' }))

      await screenDom.findByText("That code doesn't exist.")
      twd.should(await screenDom.findByTestId('total'), 'have.text', '€14.00')
    })
  })

  describe('Checkout', () => {
    it('asks for every missing detail', async () => {
      await goToCheckout()
      await userEvent.click(await screenDom.findByRole('button', { name: 'Place order' }))

      await screenDom.findByText('Enter your name.')
      await screenDom.findByText('Enter your email.')
      await screenDom.findByText('Enter a 16-digit card number.')
    })

    it('rejects an email that is not an email', async () => {
      await goToCheckout()
      await fillCheckout({ name: 'Ada', email: 'ada@', card: '4242424242424242' })

      await screenDom.findByText("That email doesn't look right.")
    })

    it('places the order and confirms it', async () => {
      await twd.mockRequest('placeOrder', {
        method: 'POST',
        url: '/api/orders',
        response: { id: 'ORD-1042', total: 2800 },
        status: 201,
      })
      await goToCheckout()
      await fillCheckout({ name: 'Ada', email: 'ada@example.com', card: '4242 4242 4242 4242' })

      const rule = await twd.waitForRequest('placeOrder')
      expect(rule.request).to.deep.equal({
        name: 'Ada',
        email: 'ada@example.com',
        items: [{ productId: 'coffee', quantity: 2 }],
        discountCode: null,
      })
      await screenDom.findByRole('heading', { name: 'Order ORD-1042 is on its way' })
      await screenDom.findByLabelText('Cart: 0 items')
    })

    it('keeps the cart when the payment is declined', async () => {
      await twd.mockRequest('placeOrder', {
        method: 'POST',
        url: '/api/orders',
        response: { message: 'Insufficient funds' },
        status: 402,
      })
      await goToCheckout()
      await fillCheckout({ name: 'Ada', email: 'ada@example.com', card: '4000000000000002' })

      await screenDom.findByText('Payment declined: Insufficient funds. Your cart is still here.')
      await screenDom.findByLabelText('Cart: 2 items')
    })
  })
})
