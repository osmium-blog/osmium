import api from '../notion-client'

export async function getPage (id: string) {
  return await api.getPage(id)
}
