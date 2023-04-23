import { useConfig } from '@/contexts/config'
import { execTemplate } from '@/lib/utils'

export default function SiteFooterText () {
  const config = useConfig()

  const text = config.footerText
    // If user defined `footerText`, use it as a template
    ? execTemplate(config.footerText, { since: getSinceText(config.since) })
    // Otherwise, generate a simple version
    : `© ${config.author} ${getSinceText(config.since)}`

  return (
    <span className="site-footer-text" dangerouslySetInnerHTML={{ __html: text }}/>
  )
}

function getSinceText (since: string | number): string {
  since = +since
  const now = new Date().getFullYear()
  return Number.isNaN(since) || since === now ? String(since) : `${since} - ${now}`
}
