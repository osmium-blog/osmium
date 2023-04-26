import type { CollectionPropertySchemaMap, PageBlock } from 'notion-types'
import { hash } from 'ohash'

import dayjs from '../dayjs'
import { config } from './config'
import NotionPage from './notion-api/notion-page'

type PostType = 'Post' | 'Doc' | 'Page' | 'Config'
const PUBLISHABLE_TYPES: PostType[] = ['Post', 'Doc', 'Page']
type PostStatus = 'Published'
const PUBLISHABLE_STATUSES: PostStatus[] = ['Published']

export interface PageMetaRaw {
  id: string
  hash: string
  type?: PostType
  hasContent: boolean
  fullWidth: boolean

  title?: string
  slug?: string
  summary?: string
  tags: string[]
  date: number
  status?: PostStatus

  parent?: string
  child?: string[]
}

export type PageMeta = PageMetaRaw & { title: string }

export default class Page implements PageMetaRaw {
  data: NotionPage

  constructor (id: string)
  constructor (block: PageBlock, schema: CollectionPropertySchemaMap)
  constructor (data: NotionPage)
  constructor (arg0: any, schema?: any) {
    this.data = arg0 instanceof NotionPage ? arg0 : new NotionPage(arg0, schema)
  }

  async sync () {
    await this.data.sync()
  }

  get id (): string { return this.data.id }
  get hash (): string { return hash(this.id) }
  get type (): PostType | undefined { return this.data.properties.type }
  get hasContent (): boolean { return this.data.content.length > 0 }
  get fullWidth (): boolean { return Boolean(this.data.format.fullWidth) }

  get title (): string | undefined { return this.data.properties.title }
  get slug (): string | undefined { return this.data.properties.slug }
  get summary (): string | undefined { return this.data.properties.summary }
  get tags (): string[] { return this.data.properties.tags ?? [] }
  get date (): number {
    if (this.data.properties.date) {
      const { startDate, startTime = '00:00', timezone = config.timezone } = this.data.properties.date
      const day = dayjs.tz(`${startDate} ${startTime}`, timezone)
      return day.valueOf()
    } else {
      return this.data.createdTime
    }
  }
  get status (): PostStatus | undefined { return this.data.properties.status }

  get parent (): string | undefined { return this.data.properties.parent?.[0] }
  get child (): string[] { return this.data.properties.child ?? [] }

  get isPublished () {
    return (
      PUBLISHABLE_TYPES.includes(this.type!) &&
      PUBLISHABLE_STATUSES.includes(this.status!) &&
      this.title &&
      this.date <= new Date().getTime() &&
      true
    )
  }

  json (): PageMeta {
    const keys = [
      'id',
      'hash',
      'type',
      'hasContent',
      'fullWidth',
      'title',
      'slug',
      'summary',
      'tags',
      'date',
      'status',
      'parent',
      'child',
    ] as Array<keyof PageMeta>
    return Object.fromEntries(
      keys
        .map(key => [key, this[key]])
        .filter(([, value]) => value !== undefined)
    )
  }
}
