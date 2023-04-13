import type { NextApiHandler } from 'next'
import Database from '@/lib/server/notion-api/database'
import { PageProps } from '@/lib/server/notion-api/page'

export async function action (): Promise<PageProps[]> {
  const db = new Database()
  await db.syncAll()
  return db.pages.map(p => p.toJson())
}

export default (async function handler (req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(await action())
  } else {
    return res.status(204).end()
  }
} as NextApiHandler)
