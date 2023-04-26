import Image from 'next/image'
import { joinURL } from 'ufo'

import css from './styles.module.scss'
import { useConfig } from '@/contexts/config'

export default function SiteTitle () {
  const config = useConfig()

  return (
    <div className={css.site_title}>
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
      <span className={css.site_description}>{config.description}</span>
    </div>
  )
}
