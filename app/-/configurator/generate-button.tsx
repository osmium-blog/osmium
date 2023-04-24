'use client'

import { useEffect, useState } from 'react'
import { useCopyToClipboard } from 'react-use'
import cn from 'classnames'

import { useConfigurator } from './configurator.context'
import { useLocale } from './locale.context'

export default function GenerateButton ({ className }: BasicProps) {
  const { t } = useLocale()

  const { config } = useConfigurator()

  const [copyState, copyToClipboard] = useCopyToClipboard()
  const [copyStatus, setCopyStatus] = useState<boolean | null>(null)

  useEffect(() => {
    if (copyState.error) {
      setCopyStatus(false)
    } else if (copyState.value != null) {
      setCopyStatus(true)
    }
    const timer = setTimeout(() => {
      setCopyStatus(null)
    }, 3e3)
    return () => clearTimeout(timer)
  }, [copyState])

  return (
    <button
      type="button"
      className={cn(
        className,
        'box-content min-w-[1.5rem] px-2 py-1 relative text-day dark:text-night bg-night dark:bg-day',
      )}
      onClick={() => copyToClipboard(JSON.stringify(config, null, 2))}
    >
      <span className={cn(
        'transition duration-100',
        copyStatus != null ? 'opacity-0' : 'delay-100',
      )}>
        {t('configurator.action.generate')}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={cn(
          'w-6 h-6 absolute inset-0 m-auto fill-current transition duration-100',
          copyStatus == null ? 'opacity-0' : 'opacity-100 delay-100',
        )}
      >
        {copyStatus != null && (
          copyStatus
            ?
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
            : (
              <path
                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
                className="fill-red-500 dark:fill-red-600"
              />
            )
        )}
      </svg>
    </button>
  )
}
