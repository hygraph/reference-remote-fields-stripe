import * as React from 'react'

import SiteLayout from '@/layout/site'

import 'tailwindcss/tailwind.css'

function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout || ((page) => <SiteLayout>{page}</SiteLayout>)

  return getLayout(<Component {...pageProps} />)
}

export default App
