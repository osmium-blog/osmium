import type { NextApiHandler } from 'next'

import Database from '@/lib/server/database'

export async function action () {
  const db = new Database()
  await db.sync()
  const entries = [...db.all.values()]
  return {
    /** @deprecated */
    pages: entries.map(page => page.json()),
    pageMap: Object.fromEntries(entries.map(page => [page.id, page.json()])),
    // For in-site navigation
    slugMap: Object.fromEntries(entries.map(page => [page.id, page.slug || page.hash])),
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
