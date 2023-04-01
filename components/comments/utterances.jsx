import { useConfig } from '@/lib/config'

export default function Utterances ({ config, post }) {
  const { appearance } = useConfig()
  const theme = {
    auto: 'preferred-color-scheme',
    light: 'github-light',
    dark: 'github-dark',
  }[appearance]

  return (
    <div id="comments" className="md:-ml-16">
      <script
        src="https://utteranc.es/client.js"
        crossorigin="anonymous"
        repo={config.repo}
        issue-term={post.id}
        theme={theme}
        async
      />
    </div>
  )
}
