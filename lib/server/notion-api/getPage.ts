import api from '../notion-client'

export default async function getPage (id: string) {
  return await api.getPage(id)
}
