import { getDateValue, getTextContent } from 'notion-utils'
import type { CollectionPropertySchemaMap, PageBlock } from 'notion-types'
import { pickBy } from 'lodash'
import { clientConfig } from '@/lib/server/config'
import api from '@/lib/server/notion-client'
import { withTimezone } from '@/lib/dayjs'

const dayjs = withTimezone(clientConfig.timezone)

type PageType = 'Page' | 'Post' | 'Config'
const VALID_TYPES: PageType[] = ['Page', 'Post']
type PageStatus = 'Published'
const VALID_STATUS: PageStatus[] = ['Published']

export default class Page {
  id: string
  type?: PageType
  title?: string
  slug?: string
  summary?: string
  tags?: string[]
  date: number = 0
  fullWidth: boolean = false
  status?: PageStatus

  constructor (public block: PageBlock, public schema: CollectionPropertySchemaMap) {
    this.id = block.id
    this.init()
  }

  init (block: PageBlock = this.block, schema: CollectionPropertySchemaMap = this.schema) {
    const props = Page.simplifyProperties(block.properties, schema)

    VALID_TYPES.includes(props.type) && (this.type = props.type)
    if (!this.type) return

    VALID_STATUS.includes(props.status) && (this.status = props.status)
    this.title = props.title
    this.slug = Page.normalizeSlug(props.slug)
    this.date = props.date || block.created_time
    if (!(this.title && this.slug && this.date <= new Date().getTime())) {
      this.status = undefined
      return
    }

    this.summary = props.summary
    props.tags?.length && (this.tags = props.tags)
    this.fullWidth = block.format?.page_full_width ?? false
  }

  async sync () {
    const { block: blockMap, collection: collectionMap } = await api.getPage(this.id)
    const block = blockMap[this.id].value as PageBlock
    const schema = collectionMap[block.parent_id].value.schema
    this.init(block, schema)
  }

  toJson () {
    return pickBy(this, (value, key) => {
      return value !== undefined && ['id', 'type', 'title', 'slug', 'summary', 'tags', 'date', 'fullWidth', 'status'].includes(key)
    })
  }

  static simplifyProperties (properties: PageBlock['properties'], schema: CollectionPropertySchemaMap) {
    return Object.fromEntries(
      Object.entries(properties || {})
        .map(([key, value]) => {
          const prop = schema[key]
          let propValue: any
          switch (prop.type) {
            case 'title':
            case 'text':
            case 'select':
              propValue = getTextContent(value as any)
              break
            case 'multi_select':
              propValue = getTextContent(value as any).split(',')
              break
            case 'date': {
              const { start_date, start_time, time_zone } = getDateValue(value as any) ?? {}
              if (start_date) {
                propValue = dayjs.tz(`${start_date} ${start_time || '00:00'}`, time_zone).valueOf()
              }
              break
            }
          }
          return [prop.name, propValue]
        })
    )
  }

  static normalizeSlug (raw?: string) {
    return (raw || '')
      .replace(/^\/+/, '')
      .replaceAll(/[;/?:@&=+$,# ]/g, '-')
  }
}
