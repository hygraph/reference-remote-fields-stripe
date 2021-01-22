import * as React from 'react'
import { gql, GraphQLClient } from 'graphql-request'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import he from 'he'
import cc from 'classcat'

import PricingPlanCard from '@/components/pricing-plan-card'

function PricingPage({ page, plans }) {
  const [activeInterval, setActiveInterval] = React.useState('year')

  const mdxSubtitle = page.subtitle ? hydrate(page.subtitle.mdx) : null

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-center">
            {page.title}
          </h1>
          {mdxSubtitle ? (
            <div className="mt-5 text-xl text-gray-500 sm:text-center">
              {mdxSubtitle}
            </div>
          ) : null}
          <div className="relative mt-6 bg-gray-100 rounded-lg p-0.5 flex self-center sm:mt-8">
            <button
              type="button"
              className={cc([
                'relative border rounded-md py-2 w-1/2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8',
                activeInterval === 'month'
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'border-transparent'
              ])}
              onClick={() => setActiveInterval('month')}
            >
              Monthly billing
            </button>
            <button
              type="button"
              className={cc([
                'relative border rounded-md py-2 w-1/2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 sm:w-auto sm:px-8',
                activeInterval === 'year'
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'border-transparent'
              ])}
              onClick={() => setActiveInterval('year')}
            >
              Annual billing
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
          {plans.map((plan) => (
            <PricingPlanCard key={plan.id} {...{ ...plan, activeInterval }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const graphCms = new GraphQLClient(process.env.GRAPHCMS_URL, {
    headers: {
      ...(process.env.GRAPHCMS_TOKEN && {
        Authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`
      })
    }
  })

  const { page, plans } = await graphCms.request(gql`
    fragment StripePriceFields on StripePrice {
      recurring {
        interval
        interval_count
      }
      currency
      unit_amount
      active
      type
      product {
        id
        name
        description
      }
    }

    {
      page(where: { slug: "pricing-plans" }) {
        id
        slug
        subtitle
        title
      }
      plans: pricingPlans {
        id
        included
        stripeAnnualPrice {
          ...StripePriceFields
        }
        stripeMonthlyPrice {
          ...StripePriceFields
        }
      }
    }
  `)

  return {
    props: {
      page: {
        ...page,
        subtitle: {
          markdown: page.subtitle,
          mdx: await renderToString(he.decode(page.subtitle))
        }
      },
      plans
    }
  }
}

export default PricingPage
