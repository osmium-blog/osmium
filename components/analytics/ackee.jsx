import { useRouter } from 'next/router'
import Script from 'next/script'
import useAckee from 'use-ackee'

export default function Ackee ({ config }) {
  const router = useRouter()
  const { tracker, dataAckeeServer, domainId } = config

  useAckee(
    router.asPath,
    { server: dataAckeeServer, domainId: domainId },
    { detailed: false, ignoreLocalhost: true }
  )

  return (
    <Script
      src={tracker}
      data-ackee-server={dataAckeeServer}
      data-ackee-domain-id={domainId}
    />
  )
}
