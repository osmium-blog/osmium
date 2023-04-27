import Head from 'next/head'
import { joinURL } from 'ufo'

import type { PageMeta } from '@/lib/server/page'
import { execTemplate } from '@/lib/utils'
import { useConfig } from '@/contexts/config'

type Props = {
  post?: PageMeta
}

export default function LayoutHead ({ post = {} as PageMeta }: Props) {
  const config = useConfig()

  const title = post.title || config.title
  const url = joinURL(config.link, config.path, post.slug || '')
  const ogImageService = config.ogImageGenerateURL && (
    config.ogImageGenerateURL === 'https://og-image-craigary.vercel.app'
      // Backward compatibility
      // TODO: remove in v2.0
      ? joinURL(config.ogImageGenerateURL, `${encodeURIComponent(title)}.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fnobelium.vercel.app%2Flogo-for-dark-bg.svg`)
      : execTemplate(config.ogImageGenerateURL, { title })
  )

  return (
    <Head>
      <title>{title}</title>

      <meta name="robots" content="follow, index"/>

      {config.seo?.keywords && (
        <meta name="keywords" content={config.seo.keywords.join(',')}/>
      )}
      {config.seo?.googleSiteVerification && (
        <meta name="google-site-verification" content={config.seo.googleSiteVerification}/>
      )}

      <meta property="og:title" content={title}/>
      <meta name="twitter:title" content={title}/>
      {post.summary && <>
        <meta name="description" content={post.summary}/>
        <meta property="og:description" content={post.summary}/>
        <meta name="twitter:description" content={post.summary}/>
      </>}
      <meta property="og:image" content={ogImageService}/>
      <meta name="twitter:image" content={ogImageService}/>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta property="og:url" content={url}/>
      <meta property="og:locale" content={config.lang}/>
      {post.id && <>
        <meta property="og:type" content="article"/>
        <meta property="article:author" content={config.author}/>
        {post.date && <meta property="article:published_time" content={new Date(post.date).toISOString()}/>}
      </>}
    </Head>
  )
}
