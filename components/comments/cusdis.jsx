import { ReactCusdis } from 'react-cusdis'
import { useRouter } from 'next/router'
import { useConfig } from '@/contexts/config'
import { useTheme } from "@/contexts/theme";

export default function Cusdis ({ config, post }) {
  const router = useRouter()
  const { link, lang } = useConfig()
  const { scheme } = useTheme()

  return (
    <ReactCusdis
      key={`cusdis-${scheme}`}
      attrs={{
        pageId: post.id,
        pageTitle: post.title,
        pageUrl: link + router.asPath,
        theme: scheme,
        ...config,
      }}
      lang={resolveLang(lang)}
    />
  )
}

function resolveLang (lang) {
  return lang.toLowerCase().startsWith('zh') ? 'zh-cn' : 'en'
}
