function SiteLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">{children}</div>
    </div>
  )
}

export const getLayout = (page) => (
  <SiteLayout {...page.props}>{page}</SiteLayout>
)

export default SiteLayout
