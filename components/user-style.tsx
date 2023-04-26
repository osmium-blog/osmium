import { useConfig } from '@/contexts/config'

export default function UserStyle () {
  const config = useConfig()

  return <style dangerouslySetInnerHTML={{ __html: config.userStyle }}/>
}
