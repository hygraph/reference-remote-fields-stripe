import * as React from 'react'

import SiteLayout from '@/layout/site'

import 'tailwindcss/tailwind.css'

function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout || ((page) => <SiteLayout>{page}</SiteLayout>)

  return (
    <React.Fragment>{getLayout(<Component {...pageProps} />)}</React.Fragment>
  )
}

export default App
