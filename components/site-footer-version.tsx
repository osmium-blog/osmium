'use client'

import { useConfig } from '@/contexts/config'

export default function SiteFooterVersion () {
  const config = useConfig()

  return config.version && (
    <span className="site-footer-version">
      Osmium ver.&nbsp;
      {/^[0-9a-f]+$/.test(config.version) ? <code>{config.version}</code> : config.version}
    </span>
  )
}
