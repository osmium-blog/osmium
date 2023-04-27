import Link from 'next/link'
import Image from 'next/image'
import { joinURL } from 'ufo'

import css from './styles.module.scss'
import { useConfig } from '@/contexts/config'

export default function SiteTitle () {
  const config = useConfig()

  return (
    <Link href="/" className={css.site_title}>
      {config.logo && (
        <Image
          src={joinURL(config.path, config.logo)}
          alt={'Logo of ' + config.title}
          width={32}
          height={32}
          className={css.site_logo}
        />
      )}
      <span className={css.site_name}>{config.title}</span>
      {config.description && <span className={`site-description ${css.site_description}`}>{config.description}</span>}
    </Link>
  )
}
