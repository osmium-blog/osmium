import fs from 'node:fs'
import { extname, resolve } from 'node:path'
import { createHash } from 'node:crypto'
import type { NextApiHandler } from 'next'
import satori from 'satori'
import { sha256 } from 'ohash'
import sharp from 'sharp'
import { clientConfig } from '@/lib/server/config'

const NOTO_SANS_SC = fs.readFileSync(resolve(process.cwd(), 'assets/fonts/NotoSansSC-Bold.otf'))
const NOTO_SERIF_SC = fs.readFileSync(resolve(process.cwd(), 'assets/fonts/NotoSerifSC-Bold.otf'))
const fonts = [
  clientConfig.font === 'serif'
    ? { name: 'Noto Serif SC', data: NOTO_SERIF_SC }
    : { name: 'Noto Sans SC', data: NOTO_SANS_SC },
]

const WIDTH = 1200
const HEIGHT = 600

type Params = {
  title: string
}

export default (async function handler (req, res) {
  const { title } = req.query as Partial<Params>

  if (!title) return res.status(204).end()

  const hash = sha256(title)
  const logo = await resolveLogo()
  const { author, emailHash } = clientConfig

  const svg = await satori(
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: '#000',
      backgroundImage: `linear-gradient(153.4349488229deg, #${hash.slice(0, 6)}80, #${hash.slice(6, 12)}80)`,
      backgroundSize: '100% 162%',
    }}>
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text
        <img
          src={logo}
          width={HEIGHT / 10}
          height={HEIGHT / 10}
          style={{ position: 'absolute', top: '10vh', right: '10vw' }}
        />
      )}
      {author && (
        <div style={{
          position: 'absolute',
          bottom: '10vh',
          left: '10vw',
          display: 'flex',
          alignItems: 'center',
          fontSize: '40px',
          lineHeight: '1.2',
          color: '#fff',
          textShadow: '4px 2px 4px #0004',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element,jsx-a11y/alt-text */}
          <img
            src={`https://gravatar.com/avatar/${emailHash}`}
            width={48}
            height={48}
            style={{ marginRight: '0.25em', borderRadius: 9999, boxShadow: '4px 2px 4px #0004' }}
          />
          <div>{author}</div>
        </div>
      )}
      <div style={{
        maxWidth: '80vw',
        fontSize: '60px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        textShadow: '4px 2px 4px #0004',
      }}>{title}</div>
    </div>,
    { width: WIDTH, height: HEIGHT, fonts },
  )
  const png = await sharp(Buffer.from(svg, 'ascii')).toFormat('png').toBuffer()
  res.setHeader('Content-Type', 'image/png')
  res.send(png)
} as NextApiHandler)

async function resolveLogo () {
  const { logo } = clientConfig

  if (!logo) return

  const raw = fs.readFileSync(resolve(process.cwd(), 'public', logo))
  const format = extname(logo).slice(1)
  return format === 'svg'
    // Nested SVG will not be rendered due to tech limitations
    ? `data:image/png;base64,${(await sharp(raw).toFormat('png').toBuffer()).toString('base64')}`
    : `data:image/${format};base64,${raw.toString('base64')}`
}
