import type { NextApiHandler } from 'next'

import { readConfig } from '@/lib/server/config'

export function action () {
  return readConfig()
}

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    return res.json(action())
  } else {
    return res.status(204).end()
  }
}

export default handler
