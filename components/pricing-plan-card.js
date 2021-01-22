import * as React from 'react'

import CheckIcon from '@/icons/check'

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
        <a
          href="#"
          className="mt-8 block w-full bg-indigo-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-indigo-700"
        >
          Subscribe to {activePrice.product.name}
        </a>
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
