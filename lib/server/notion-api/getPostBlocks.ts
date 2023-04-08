import api from '../notion-client'

export async function getPostBlocks (id: string) {
  return await api.getPage(id)
}
