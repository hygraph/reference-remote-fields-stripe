import NextStripe from 'next-stripe'

const options = {
  secret_key: process.env.STRIPE_SECRET_KEY
}

export default (req, res) => NextStripe(req, res, options)
