import { config } from '@/lib/server/config'
import Database from '@/lib/server/notion-api/database'
import { generateRss } from '@/lib/rss'

const NOTHING = { props: {} }

export async function getServerSideProps ({ res }) {
  const { databaseId, rss } = config

  if (!rss) {
    res.statusCode = 204
    res.end()
    return NOTHING
  }

  const db = new Database(databaseId)
  await db.syncAll()

  const posts = db.posts.map(post => post.toJson())
  const xmlFeed = await generateRss(posts.slice(0, 10))
  res.setHeader('Content-Type', 'text/xml')
  res.write(xmlFeed)
  res.end()
  return NOTHING
}

export default function TheFeed () {}
