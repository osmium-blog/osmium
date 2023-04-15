import Image from 'next/image'
import { useConfig } from '@/lib/config'

type Props = {
  className?: string
}

export default function UserAvatar ({ className }: Props) {
  const { author, emailHash } = useConfig()

  if (!emailHash) return null

  const src = `https://gravatar.com/avatar/${emailHash}`

  return (
    <Image src={src} alt={author} width={24} height={24} className={className}/>
  )
}
