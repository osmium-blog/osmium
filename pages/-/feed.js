import { config } from '@/lib/server/config'
import Database from '@/lib/server/notion-api/database'
import { generateRss } from '@/lib/rss'

export async function getServerSideProps ({ res }) {
  const db = new Database(config.databaseId)
  await db.syncAll()

  const posts = db.posts.map(post => post.toJson())
  const xmlFeed = await generateRss(posts.slice(0, 10))
  res.setHeader('Content-Type', 'text/xml')
  res.write(xmlFeed)
  res.end()
  return {
    props: {},
  }
}

export default function TheFeed () {}
