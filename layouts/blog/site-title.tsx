import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { joinURL } from 'ufo'

import { useConfig } from '@/contexts/config'
import { useLocale } from '@/contexts/locale'

type Props = {
  pageTitle?: string
}

export default function SiteTitle ({ pageTitle }: Props) {
  const router = useRouter()
  const config = useConfig()
  const locale = useLocale()

  return (
    <Link href="/" aria-label={config.title} className="site-block-title">
      {config.logo && (
        <Image
          src={joinURL(config.path, config.logo)}
          alt={'Logo of ' + config.title}
          width={32}
          height={32}
          className="site-logo"
        />
      )}
      <span>
        {router.asPath !== '/' && <span className="back-to-home">{locale.NAV.BACK_TO_HOME}</span>}
        {pageTitle && <span className="page-title">{pageTitle}</span>}
        <span className="site-title">
          <span className="site-name">{config.title}</span>
          {config.description && <span className="site-description">{config.description}</span>}
        </span>
      </span>
    </Link>
  )
}
