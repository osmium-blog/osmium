import { useConfig } from '@/lib/config'

export default function Footer ({ fullWidth }) {
  const { author, since, version } = useConfig()

  const d = new Date()
  const y = d.getFullYear()
  const from = +since
  return (
    <div
      className={`mt-6 flex-shrink-0 m-auto w-full text-gray-500 dark:text-gray-400 transition-all ${
        !fullWidth ? 'max-w-2xl px-4' : 'px-4 md:px-24'
      }`}
    >
      <div className="py-4 text-sm leading-6 border-t border-gray-200 dark:border-gray-600">
        <div className="flex align-baseline flex-wrap">
          <span>© {author} {from === y || !from ? y : `${from} - ${y}`}</span>
          {version && (
            <span className="ml-auto text-right">
              Osmium ver.&nbsp;
              {/^[0-9a-f]+$/.test(version) ? <code>{version}</code> : version}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
