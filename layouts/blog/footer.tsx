import cn from 'classnames'

import css from './styles.module.scss'
import SiteFooterText from '@/components/site-footer-text'
import SiteFooterVersion from '@/components/site-footer-version'

type Props = {
  fullWidth?: boolean
}

export default function Footer ({ fullWidth }: Props) {
  return (
    <div className={cn(
      css.layout_footer,
      'mt-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all',
      fullWidth ? 'px-4 md:px-24' : 'max-w-2xl px-4',
    )}>
      <div className="py-4 text-sm leading-6 border-t border-gray-200 dark:border-gray-600">
        <div className="flex align-baseline flex-wrap">
          <SiteFooterText/>
          <SiteFooterVersion/>
        </div>
      </div>
    </div>
  )
}
