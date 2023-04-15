import Link from 'next/link'
import cn from 'classnames'

import { useConfig } from '@/contexts/config'
import { useLocale } from '@/contexts/locale'

type Props = {
  page: string | number
  showNext?: boolean
}

export default function Pagination ({ page, showNext }: Props) {
  const config = useConfig()
  const locale = useLocale()

  const currentPage = +page

  let additionalClassName: string
  switch (true) {
    case currentPage === 1 && showNext:
      additionalClassName = 'justify-end'
      break
    case currentPage !== 1 && !showNext:
      additionalClassName = 'justify-start'
      break
    default:
      additionalClassName = 'justify-between'
  }

  return (
    <div className={cn('flex font-medium text-black dark:text-gray-100', additionalClassName)}>
      {currentPage !== 1 && (
        <Link href={currentPage - 1 === 1 ? `${config.path || '/'}` : `/page/${currentPage - 1}`}>
          <button rel="prev" className="block cursor-pointer">
            ← {locale.PAGINATION.PREV}
          </button>
        </Link>
      )}
      {showNext && (
        <Link href={`/page/${currentPage + 1}`}>
          <button rel="next" className="block cursor-pointer">
            {locale.PAGINATION.NEXT} →
          </button>
        </Link>
      )}
    </div>
  )
}
