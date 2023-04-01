import api from '@/lib/server/notion-client'

export async function getPostBlocks (id) {
  return await api.getPage(id)
}
