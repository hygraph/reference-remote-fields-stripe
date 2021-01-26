import * as React from 'react'
import { createCheckoutSession } from 'next-stripe/client'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function PricingPlanCard({
  activeInterval,
  includedFeatures,
  stripeAnnualPrice,
  stripeMonthlyPrice
}) {
  const [activePrice, setActivePrice] = React.useState((activeInterval) =>
    activeInterval === 'year' ? stripeAnnualPrice : stripeMonthlyPrice
  )

  React.useEffect(() => {
    const activePrice = [stripeAnnualPrice, stripeMonthlyPrice].find(
      (price) => price.recurring.interval === activeInterval
    )

    setActivePrice(activePrice)
  }, [activeInterval])

  const onClick = async () => {
    try {
      const stripe = await stripePromise

      const session = await createCheckoutSession({
        success_url: window.location.href,
        cancel_url: window.location.href,
        line_items: [{ price: activePrice.id, quantity: 1 }],
        payment_method_types: ['card'],
        mode: 'subscription'
      })

      return stripe.redirectToCheckout({ sessionId: session.id })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-white border-gray-200 text-gray-500 flex flex-col overflow-hidden border-t-8 rounded-lg shadow-sm">
      <div className="lg:h-84 px-6 py-8 space-y-6">
        <h3 className="font-bold leading-10 text-gray-900 text-4xl">
          {activePrice.product.name}
        </h3>
        <p>
          <span className="text-4xl font-extrabold text-gray-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: activePrice.currency,
              minimumFractionDigits: 0
            }).format(activePrice.unit_amount / 100)}
          </span>
          <span className="text-base font-medium text-gray-500">
            {`/${activePrice.recurring.interval}`}
          </span>
        </p>
        <p>{activePrice.product.description}</p>
      </div>
      <div className="bg-gray-50 flex flex-1 flex-col px-6 py-5">
        <ul className="flex-1 list-outside list-disc mb-10 px-3 space-y-3">
          {includedFeatures.map((feature, index) => (
            <li key={index} className="text-indigo-600">
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <button
          className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700"
          onClick={onClick}
        >
          Subscribe to {activePrice.product.name}
        </button>
      </div>
    </div>
  )
}

export default PricingPlanCard
