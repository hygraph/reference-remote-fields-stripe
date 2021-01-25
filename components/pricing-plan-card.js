import * as React from 'react'
import { loadStripe } from '@stripe/stripe-js'

import CheckIcon from '@/icons/check'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function PricingPlanCard({
  activeInterval,
  included,
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

      const session = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success_url: window.location.href,
          cancel_url: window.location.href,
          line_items: [{ price: activePrice.id, quantity: 1 }]
        })
      }).then((res) => res.json())

      return stripe.redirectToCheckout({ sessionId: session.id })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
      <div className="p-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          {activePrice.product.name}
        </h2>
        {activePrice.product.description ? (
          <p className="mt-4 text-sm text-gray-500">
            {activePrice.product.description}
          </p>
        ) : null}
        <p className="mt-8">
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
        <button
          className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700"
          onClick={onClick}
        >
          Subscribe to {activePrice.product.name}
        </button>
      </div>
      <div className="pt-6 pb-8 px-6">
        <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
          What's included
        </h3>
        <ul className="mt-6 space-y-4">
          {included.map((feature, index) => (
            <li key={index} className="flex space-x-3">
              <CheckIcon
                className="flex-shrink-0 h-5 w-5 text-green-500"
                aria-hidden="true"
              />
              <span className="text-sm text-gray-500">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PricingPlanCard
