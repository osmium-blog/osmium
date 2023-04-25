import { langs } from '@/assets/i18n'
import { get } from 'lodash'

export type SchemaEntryData = {
  when?: [string, string]
  description?: string
  richText?: true
} & (
  | {
  type: 'string'
  default: string
} | {
  type: 'number'
  default: number
} | {
  type: 'boolean'
  default: boolean
} | {
  type: 'color'
  default: string
} | {
  type: 'select'
  options: [string, string][]
  default: string
} | {
  type: 'list'
  default: string[]
} | {
  type: 'group'
  schema: Schema
})

export type Schema = Record<string, SchemaEntryData>

export const schema: Schema = {
  title: {
    type: 'string',
    default: 'An Osmium Site',
  },
  description: {
    type: 'string',
    default: 'lorem ipsum dolor sit amet.',
  },
  link: {
    type: 'string',
    default: 'https://osmium-blog.vercel.app',
  },
  since: {
    type: 'number',
    default: 2023,
  },
  footerText: {
    type: 'string',
    default: '',
    richText: true,
  },
  author: {
    type: 'string',
    default: 'Osmium user',
  },
  email: {
    type: 'string',
    default: 'osmium@example.com',
  },
  socialLink: {
    type: 'string',
    default: '',
  },
  mode: {
    type: 'select',
    options: [
      ['blog', 'configurator.entry.mode.option.blog'],
      ['docs', 'configurator.entry.mode.option.docs'],
    ],
    default: 'blog',
  },
  lang: {
    type: 'select',
    options: langs as [string, string][],
    default: 'en-US',
  },
  timezone: {
    type: 'string',
    default: 'Asia/Shanghai',
  },
  appearance: {
    type: 'select',
    options: [
      ['auto', 'configurator.entry.appearance.option.auto'],
      ['light', 'configurator.entry.appearance.option.light'],
      ['dark', 'configurator.entry.appearance.option.dark'],
    ],
    default: 'auto',
  },
  font: {
    type: 'select',
    options: [
      ['sans-serif', 'configurator.entry.font.option.sans'],
      ['serif', 'configurator.entry.font.option.serif'],
    ],
    default: 'sans-serif',
  },
  lightBackground: {
    type: 'color',
    default: '#ffffff',
  },
  darkBackground: {
    type: 'color',
    default: '#191919',
  },
  postsPerPage: {
    type: 'number',
    default: 7,
  },
  sortByDate: {
    type: 'boolean',
    default: false,
  },
  path: {
    type: 'string',
    default: '',
  },
  ogImageGenerateURL: {
    type: 'string',
    default: '',
  },
  rss: {
    type: 'boolean',
    default: true,
  },
  seo: {
    type: 'group',
    schema: {
      keywords: {
        type: 'list',
        default: ['Blog', 'Website', 'Notion'],
      },
      googleSiteVerification: {
        type: 'string',
        default: '',
      },
    },
  },
  analytics: {
    type: 'group',
    schema: {
      provider: {
        type: 'select',
        options: [
          ['', 'configurator.entry.analytics.provider.option.null'],
          ['ga', 'Google Analytics'],
          ['ackee', 'Ackee'],
          ['vercel', 'Vercel'],
        ],
        default: '',
      },
      ackee: {
        when: ['analytics.provider', 'ackee'],
        type: 'group',
        schema: {
          tracker: {
            type: 'string',
            default: '',
          },
          dataAckeeServer: {
            type: 'string',
            default: '',
          },
          domainId: {
            type: 'string',
            default: '',
          },
        },
      },
      ga: {
        when: ['analytics.provider', 'ga'],
        type: 'group',
        schema: {
          measurementId: {
            type: 'string',
            default: '',
          },
        },
      },
    },
  },
  comment: {
    type: 'group',
    schema: {
      provider: {
        type: 'select',
        options: [
          ['', 'configurator.entry.comment.provider.option.null'],
          ['gitalk', 'Gitalk'],
          ['utterances', 'Utterances'],
          ['cusdis', 'Cusdis'],
        ],
        default: '',
      },
      gitalk: {
        when: ['comment.provider', 'gitalk'],
        type: 'group',
        schema: {
          repo: {
            type: 'string',
            default: '',
          },
          owner: {
            type: 'string',
            default: '',
          },
          admin: {
            type: 'list',
            default: [],
          },
          clientID: {
            type: 'string',
            default: '',
          },
          clientSecret: {
            type: 'string',
            default: '',
          },
          distractionFreeMode: {
            type: 'boolean',
            default: false,
          },
        },
      },
      utterances: {
        when: ['comment.provider', 'utterances'],
        type: 'group',
        schema: {
          repo: {
            type: 'string',
            default: '',
          },
        },
      },
      cusdis: {
        when: ['comment.provider', 'cusdis'],
        type: 'group',
        schema: {
          appId: {
            type: 'string',
            default: '',
          },
          host: {
            type: 'string',
            default: 'https:/cusdis.com',
          },
          scriptSrc: {
            type: 'string',
            default: 'https://cusdis.com/js/cusdis.es.js',
          },
        },
      },
    },
  },
}

export function getSchema (path: string | string[]) {
  if (Array.isArray(path)) {
    path = path.join('.')
  }
  return get(schema, path.replaceAll('.', '.schema.'))
}

export function defaultConfig (): Osmium.Config {
  function parseSchema (schema: Record<string, any>): Record<string, JsonValue> {
    return Object.fromEntries(
      Object.entries(schema).map(([key, value]) => [
        key,
        value.schema ? parseSchema(value.schema) : value.default,
      ])
    )
  }

  return parseSchema(schema)
}
