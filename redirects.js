const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Redirect old university-dashboard route to unified dashboard
  const universityDashboardRedirect = {
    source: '/university-dashboard/:path*',
    destination: '/dashboard/:path*',
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, universityDashboardRedirect]

  return redirects
}

export default redirects
