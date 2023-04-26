import { get } from 'lodash'

import { langs } from './i18n'

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
  options: Array<string | [string, string]>
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
    description: 'configurator.entry.title.description',
    type: 'string',
    default: 'An Osmium Site',
  },
  description: {
    description: 'configurator.entry.description.description',
    type: 'string',
    default: 'lorem ipsum dolor sit amet.',
  },
  link: {
    description: 'configurator.entry.link.description',
    type: 'string',
    default: 'https://osmium-blog.vercel.app',
  },
  since: {
    description: 'configurator.entry.since.description',
    type: 'number',
    default: 2023,
  },
  footerText: {
    description: 'configurator.entry.footerText.description',
    type: 'string',
    default: '',
    richText: true,
  },
  author: {
    description: 'configurator.entry.author.description',
    type: 'string',
    default: 'Osmium user',
  },
  email: {
    description: 'configurator.entry.email.description',
    type: 'string',
    default: 'osmium@example.com',
  },
  socialLink: {
    description: 'configurator.entry.socialLink.description',
    type: 'string',
    default: '',
  },
  layout: {
    description: 'configurator.entry.layout.description',
    type: 'select',
    options: [
      ['blog', 'configurator.entry.layout.option.blog'],
      ['docs', 'configurator.entry.layout.option.docs'],
    ],
    default: 'blog',
  },
  lang: {
    description: 'configurator.entry.lang.description',
    type: 'select',
    options: langs,
    default: 'en-US',
  },
  timezone: {
    description: 'configurator.entry.timezone.description',
    type: 'string',
    default: 'Asia/Shanghai',
  },
  appearance: {
    description: 'configurator.entry.appearance.description',
    type: 'select',
    options: [
      ['auto', 'configurator.entry.appearance.option.auto'],
      ['light', 'configurator.entry.appearance.option.light'],
      ['dark', 'configurator.entry.appearance.option.dark'],
    ],
    default: 'auto',
  },
  font: {
    description: 'configurator.entry.font.description',
    type: 'select',
    options: [
      ['sans-serif', 'configurator.entry.font.option.sans'],
      ['serif', 'configurator.entry.font.option.serif'],
    ],
    default: 'sans-serif',
  },
  lightBackground: {
    description: 'configurator.entry.lightBackground.description',
    type: 'color',
    default: '#ffffff',
  },
  darkBackground: {
    description: 'configurator.entry.darkBackground.description',
    type: 'color',
    default: '#191919',
  },
  postsPerPage: {
    description: 'configurator.entry.postsPerPage.description',
    type: 'number',
    default: 7,
  },
  sortByDate: {
    description: 'configurator.entry.sortByDate.description',
    type: 'boolean',
    default: false,
  },
  path: {
    description: 'configurator.entry.path.description',
    type: 'string',
    default: '',
  },
  ogImageGenerateURL: {
    description: 'configurator.entry.ogImageGenerateURL.description',
    type: 'string',
    default: '',
  },
  rss: {
    description: 'configurator.entry.rss.description',
    type: 'boolean',
    default: true,
  },
  seo: {
    description: 'configurator.entry.seo.description',
    type: 'group',
    schema: {
      keywords: {
        description: 'configurator.entry.seo.keywords.description',
        type: 'list',
        default: ['Blog', 'Website', 'Notion'],
      },
      googleSiteVerification: {
        description: 'configurator.entry.seo.googleSiteVerification.description',
        type: 'string',
        default: '',
      },
    },
  },
  analytics: {
    description: 'configurator.entry.analytics.description',
    type: 'group',
    schema: {
      provider: {
        description: 'configurator.entry.analytics.provider.description',
        type: 'select',
        options: [
          ['', 'configurator.entry.analytics.provider.option.null'],
          ['ga', 'Google Analytics'],
          ['ackee', 'Ackee'],
          ['vercel', 'configurator.entry.analytics.provider.option.vercel'],
        ],
        default: '',
      },
      ackee: {
        description: 'configurator.entry.analytics.ackee.description',
        when: ['analytics.provider', 'ackee'],
        type: 'group',
        schema: {
          tracker: {
            description: 'configurator.entry.analytics.ackee.tracker.description',
            type: 'string',
            default: '',
          },
          dataAckeeServer: {
            description: 'configurator.entry.analytics.ackee.dataAckeeServer.description',
            type: 'string',
            default: '',
          },
          domainId: {
            description: 'configurator.entry.analytics.ackee.domainId.description',
            type: 'string',
            default: '',
          },
        },
      },
      ga: {
        description: 'configurator.entry.analytics.ga.description',
        when: ['analytics.provider', 'ga'],
        type: 'group',
        schema: {
          measurementId: {
            description: 'configurator.entry.analytics.ga.measurementId.description',
            type: 'string',
            default: '',
          },
        },
      },
    },
  },
  comment: {
    description: 'configurator.entry.comment.description',
    type: 'group',
    schema: {
      provider: {
        description: 'configurator.entry.comment.provider.description',
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
        description: 'configurator.entry.comment.gitalk.description',
        when: ['comment.provider', 'gitalk'],
        type: 'group',
        schema: {
          repo: {
            description: 'configurator.entry.comment.gitalk.repo.description',
            type: 'string',
            default: '',
          },
          owner: {
            description: 'configurator.entry.comment.gitalk.owner.description',
            type: 'string',
            default: '',
          },
          admin: {
            description: 'configurator.entry.comment.gitalk.admin.description',
            type: 'list',
            default: [],
          },
          clientID: {
            // description: 'configurator.entry.comment.gitalk.clientID.description',
            type: 'string',
            default: '',
          },
          clientSecret: {
            // description: 'configurator.entry.comment.gitalk.clientSecret.description',
            type: 'string',
            default: '',
          },
          distractionFreeMode: {
            description: 'configurator.entry.comment.gitalk.distractionFreeMode.description',
            type: 'boolean',
            default: false,
          },
        },
      },
      utterances: {
        description: 'configurator.entry.comment.utterances.description',
        when: ['comment.provider', 'utterances'],
        type: 'group',
        schema: {
          repo: {
            description: 'configurator.entry.comment.utterances.repo.description',
            type: 'string',
            default: '',
          },
        },
      },
      cusdis: {
        description: 'configurator.entry.comment.cusdis.description',
        when: ['comment.provider', 'cusdis'],
        type: 'group',
        schema: {
          appId: {
            // description: 'configurator.entry.comment.cusdis.appId.description',
            type: 'string',
            default: '',
          },
          host: {
            description: 'configurator.entry.comment.cusdis.host.description',
            type: 'string',
            default: 'https:/cusdis.com',
          },
          scriptSrc: {
            description: 'configurator.entry.comment.cusdis.scriptSrc.description',
            type: 'string',
            default: 'https://cusdis.com/js/cusdis.es.js',
          },
        },
      },
    },
  },
}

export function getEntry (path: string | string[]) {
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
