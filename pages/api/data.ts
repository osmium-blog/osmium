import type { NextApiHandler } from 'next'

import Database from '@/lib/server/notion-api/database'

export async function action () {
  const db = new Database()
  await db.syncAll()
  return {
    pages: db.pages.map(p => p.id),
    posts: db.posts.map(p => p.id),
    entryMap: Object.fromEntries(Object.entries(db.pageMap).map(([id, page]) => [id, page.toJson()])),
  }
}

export type Data = Awaited<ReturnType<typeof action>>

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(await action())
  } else {
    return res.status(204).end()
  }
}
export default handler
