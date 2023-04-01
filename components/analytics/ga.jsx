import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Script from 'next/script'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
const pageview = (gTag, url) => {
  window.gtag('config', gTag, {
    page_path: url,
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
// FIXME: Really useful?
const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

export default function GA ({ config }) {
  const router = useRouter()
  const { measurementId } = config

  useEffect(() => {
    const handleRouteChange = url => {
      pageview(measurementId, url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [measurementId, router.events])

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}/>
      <Script id="ga" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {page_path: window.location.pathname});
        `}
      </Script>
    </>
  )
}
