import { getTextContent, getDateValue } from 'notion-utils'
import type {
  BlockMap,
  CollectionPropertySchemaMap,
  DateFormat,
  Decoration,
  UserFormat,
} from 'notion-types'
import api from '../notion-client'
import type { PostMeta } from './utils'

export default async function getPageProperties (id: string, block: BlockMap, schema: CollectionPropertySchemaMap) {
  const rawProperties = Object.entries(block?.[id]?.value?.properties || [])
  const excludeProperties = ['date', 'select', 'multi_select', 'person']
  const properties = {} as PostMeta
  for (const [key, val] of rawProperties) {
    properties.id = id
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val as Decoration[])
    } else {
      switch (schema[key]?.type) {
        case 'date': {
          const dateProperty: any = getDateValue(val as [['‣', [DateFormat]]])
          delete dateProperty.type
          properties[schema[key].name] = dateProperty
          break
        }
        case 'select':
        case 'multi_select': {
          const selects = getTextContent(val as Decoration[])
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(',')
          }
          break
        }
        case 'person': {
          const rawUsers = (val as UserFormat[]).flat()
          const users = []
          for (const item of rawUsers) {
            const userId = item[0]
            if (userId[1]) {
              const res = await api.getUsers([userId])
              // FIXME: What is this?
              // @ts-ignore
              const resValue = res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value
              const user = {
                id: resValue?.id,
                first_name: resValue?.given_name,
                last_name: resValue?.family_name,
                profile_photo: resValue?.profile_photo,
              }
              users.push(user)
            }
          }
          properties[schema[key].name] = users
          break
        }
        default:
          break
      }
    }
  }
  return properties
}
