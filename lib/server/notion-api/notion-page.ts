import { getDateValue, getTextContent } from 'notion-utils'
import type { CollectionPropertySchemaMap, ExtendedRecordMap, PageBlock } from 'notion-types'

import { withTimezone } from '../../dayjs'
import { config } from '../config'
import api from '../notion-client'

const dayjs = withTimezone(config.timezone)

export default class NotionPage {
  id: string
  type!: string
  parentId!: string
  parentTable!: string
  createdTime!: number
  /** @deprecated Use `content` instead */
  hasContent!: boolean
  /** @deprecated Use `format` instead */
  fullWidth!: boolean

  format: Partial<ReturnType<typeof NotionPage['parseFormat']>> = {}
  properties: Record<string, JsonValue> = {}
  content: string[] = []

  block?: PageBlock
  schema?: CollectionPropertySchemaMap
  recordMap?: ExtendedRecordMap

  constructor (id: string)
  constructor (block: PageBlock, schema: CollectionPropertySchemaMap)
  constructor (idOrBlock: any, schema?: any) {
    if (typeof idOrBlock === 'string') {
      this.id = idOrBlock
    } else {
      this.id = idOrBlock.id
      this.init(idOrBlock, schema)
    }
  }

  init (block?: PageBlock, schema?: CollectionPropertySchemaMap) {
    this.block = block = block ?? this.block
    this.schema = schema = schema ?? this.schema

    if (!block) throw new Error(`${this.id} does not have any block data`)
    if (!schema) throw new Error(`${this.id} does not have any schema data`)

    this.type = block.type
    this.parentId = block.parent_id
    this.parentTable = block.parent_table
    this.createdTime = block.created_time
    this.hasContent = Boolean(block.content?.length)
    this.fullWidth = block.format?.page_full_width ?? false

    this.format = NotionPage.parseFormat(block.format)
    this.properties = NotionPage.parseProperties(block.properties, schema)
    this.content = block.content ?? []
  }

  async sync () {
    this.recordMap = await api.getPage(this.id)
    const block = this.recordMap.block[this.id].value as PageBlock
    this.init(block, this.recordMap.collection[block.parent_id].value.schema)
  }

  static parseFormat (format?: PageBlock['format']) {
    format ??= {}
    return {
      icon: format.page_icon,
      fullWidth: Boolean(format.page_full_width),
    }
  }

  static parseProperties (properties: PageBlock['properties'], schema: CollectionPropertySchemaMap): Record<string, JsonValue> {
    return Object.fromEntries(
      Object.entries(properties || {})
        .map(([key, value]) => {
          const prop = schema[key]
          if (!prop) return null as never

          let propValue: any
          switch (prop.type) {
            case 'title':
            case 'text':
            case 'select':
              propValue = getTextContent(value as any)
              break
            case 'multi_select':
              propValue = getTextContent(value as any)
                .split(',')
                // Sometimes it could be an empty string, so we need to filter it out
                .filter(Boolean)
              break
            case 'date': {
              const { start_date, start_time, time_zone } = getDateValue(value as any) ?? {}
              if (start_date) {
                propValue = dayjs.tz(`${start_date} ${start_time || '00:00'}`, time_zone).valueOf()
              }
              break
            }
            case 'relation':
              // TODO: Complete the type check later
              // @ts-ignore
              propValue = value.filter(it => it[0] === '‣').map(it => it[1][0][1])
              break
            default:
              console.warn(`Unsupported property type: ${prop.type}`)
              debugger
          }
          return [prop.name, propValue]
        })
        .filter(Boolean)
    )
  }
}
