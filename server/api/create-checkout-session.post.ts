import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  if (!config.stripeSecretKey || !config.public.stripeProductId) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe is not configured.' })
  }

  const stripe = new Stripe(config.stripeSecretKey)
  const origin = getRequestURL(event).origin
  const product = await stripe.products.retrieve(config.public.stripeProductId)
  const defaultPrice = typeof product.default_price === 'string'
    ? product.default_price
    : product.default_price?.id

  if (!defaultPrice) {
    throw createError({
      statusCode: 500,
      statusMessage: 'The Stripe product needs a default price before checkout can open.'
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price: defaultPrice,
      quantity: 1
    }],
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancelled`
  })

  if (!session.url) {
    throw createError({ statusCode: 500, statusMessage: 'Unable to create checkout session.' })
  }

  return { url: session.url }
})
