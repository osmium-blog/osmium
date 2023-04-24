import '@/styles/globals.scss'
import { ConfigProvider } from '@/contexts/config'
import { readConfig } from '@/lib/server/config'

export default function RootLayout ({ children }: BasicProps) {
  return (
    // TODO: Dynamic lang
    // TODO: Dynamic color scheme
    <html lang="en">
      <body>
        <ConfigProvider value={readConfig()}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}
