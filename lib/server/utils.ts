import { createHash } from 'node:crypto'

export function md5 (input?: string) {
  return input
    ? createHash('md5').update(input).digest('hex').trim().toLowerCase()
    : undefined
}
