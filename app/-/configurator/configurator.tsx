'use client'

import { useEffect } from 'react'
import { clone, get } from 'lodash'
import cn from 'classnames'

import css from './page.module.scss'
import example from '@/assets/config-data'
import { langs } from '@/assets/i18n'
import Switch from '@/components/ui/switch'
import Select from '@/components/ui/select'
import TextInput from '@/components/ui/text-input'
import NumberInput from '@/components/ui/number-input'
import ColorInput from '@/components/ui/color-input'
import { ConfiguratorProvider, useConfigurator } from './configurator.context'
import { useLocale } from './locale.context'

const INDENT = 20

// Override some entries for special behaviors
const overrides: Record<string, any> = {
  lightBackground: { type: 'color' },
  darkBackground: { type: 'color' },
  lang: { type: 'select', options: langs },
  mode: {
    type: 'select',
    options: [
      ['blog', 'configurator.entry.mode.option.blog'],
      ['docs', 'configurator.entry.mode.option.docs'],
    ],
  },
  footerText: { richText: true },
  appearance: {
    type: 'select',
    options: [
      ['auto', 'configurator.entry.appearance.option.auto'],
      ['light', 'configurator.entry.appearance.option.light'],
      ['dark', 'configurator.entry.appearance.option.dark'],
    ],
  },
  font: {
    type: 'select',
    options: [
      ['sans-serif', 'configurator.entry.font.option.sans'],
      ['serif', 'configurator.entry.font.option.serif'],
    ],
  },
  'analytics.provider': {
    type: 'select',
    options: [
      ['', 'configurator.entry.analytics.provider.option.null'],
      ['ga', 'Google Analytics'],
      ['ackee', 'Ackee'],
      ['vercel', 'Vercel'],
    ],
  },
  'analytics.gaConfig': { when: ['analytics.provider', 'ga'] },
  'analytics.ackeeConfig': { when: ['analytics.provider', 'ackee'] },
  'comment.provider': {
    type: 'select',
    options: [
      ['', 'configurator.entry.comment.provider.option.null'],
      ['gitalk', 'Gitalk'],
      ['utterances', 'Utterances'],
      ['cusdis', 'Cusdis'],
    ],
  },
  'comment.gitalkConfig': { when: ['comment.provider', 'gitalk'] },
  'comment.utterancesConfig': { when: ['comment.provider', 'utterances'] },
  'comment.cusdisConfig': { when: ['comment.provider', 'cusdis'] },
}

export default function Configurator () {
  const { config } = useConfigurator()
  const entries = Object.entries(config)

  return (
    <ConfigEntryGroup entries={entries}/>
  )
}

type ConfigEntryGroupProps = {
  entries: Array<[string, JsonValue]>
  parent?: string[]
}

function ConfigEntryGroup ({ entries, parent = [] }: ConfigEntryGroupProps) {
  return (
    <div className="space-y-3">
      {entries.map(entry => {
        const name = entry[0]
        return <ConfigEntry key={name} entry={entry} parent={parent}/>
      })}
    </div>
  )
}

function resolveType (value: JsonValue) {
  const type = typeof value
  if (type === 'object') {
    switch (true) {
      case Array.isArray(value):
        return 'array'
      case value === null:
        return 'null'
    }
  }
  return type
}

type ConfigEntryProps = {
  entry: [string, JsonValue]
  parent?: string[]
}

function ConfigEntry ({ entry: [name, value], parent = [] }: ConfigEntryProps) {
  const { config, setConfig } = useConfigurator()
  const { t } = useLocale()
  const level = parent.length
  const keyPath = parent.concat(name).join('.')
  const override = overrides[keyPath]
  const exampleValue = clone(get(example, keyPath))
  const valueType = override?.when && get(config, override.when[0]) !== override.when[1]
    ? null
    : override?.type ?? resolveType(exampleValue)

  useEffect(
    () => {
      if (override?.when) {
        if (valueType) {
          if (get(config, keyPath) === undefined) {
            setConfig(name, exampleValue)
          }
        } else {
          setConfig(name, undefined)
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keyPath, valueType],
  )

  let content: ReactNode | null = null
  switch (valueType) {
    case 'string':
      content = (
        <TextInput value={value} onChange={value => setConfig(name, value)}/>
      )
      break
    case 'number':
      content = (
        <NumberInput value={value} onChange={value => setConfig(name, value)}/>
      )
      break
    case 'boolean':
      content = (
        <div className="h-8 flex items-center">
          <Switch checked={Boolean(value)} onChange={checked => setConfig(name, checked)}/>
        </div>
      )
      break
    case 'array':
      content = (
        <TextInput
          value={value.join(', ')}
          onChange={value => setConfig(name, value.split(/\s*,\s*/).filter(Boolean))}
        />
      )
      break
    case 'color':
      content = (
        <ColorInput value={value} onChange={value => setConfig(name, value)}/>
      )
      break
    case 'select':
      content = (
        <Select value={value} onChange={value => setConfig(name, value)}>
          {override.options.map((opt: string | [string, string]) => {
            const [value, label] = typeof opt === 'string' ? [opt, opt] : opt
            return (
              <option key={value} value={value}>{t(label)}</option>
            )
          })}
        </Select>
      )
      break
    case 'object': {
      const description = t(['configurator', 'entry', ...parent, name, 'description'])
      const _setConfig = (key: string | string[], value: JsonValue) => setConfig(([] as string[]).concat(name, key), value)

      return (
        <ConfiguratorProvider config={config} setConfig={_setConfig}>
          <div className="text-sm">
            <code style={{ paddingLeft: INDENT * level + 'px' }}>{name}</code>
            {description && (
              <p
                className={cn(css.entry_description, 'opacity-50')}
                style={{ paddingLeft: INDENT * level + 'px' }}
                dangerouslySetInnerHTML={override?.richText ? { __html: description } : undefined}
              >
                {override?.richText ? null : description}
              </p>
            )}
          </div>
          <ConfigEntryGroup
            entries={Object.entries(value || exampleValue)}
            parent={parent.concat(name)}
          />
        </ConfiguratorProvider>
      )
    }
  }

  return content && (
    <ConfigEntryLayout
      name={name}
      parent={parent}
      richText={override?.richText}
    >
      {content}
    </ConfigEntryLayout>
  )
}

type ConfigEntryLayoutProps = BasicProps & {
  name: string
  parent?: string[]
  richText?: boolean
}

function ConfigEntryLayout ({ name, parent = [], richText = false, children }: ConfigEntryLayoutProps) {
  const { t } = useLocale()
  const description = t(['configurator', 'entry', ...parent, name, 'description'])
  const level = parent.length

  return (
    <div className="flex">
      <div className="flex-[1.5_1.5_0] text-sm">
        <code style={{ paddingLeft: INDENT * level + 'px' }}>{name}</code>
        {description && (
          <p
            className={cn(css.entry_description, 'pr-5 opacity-50')}
            style={{ paddingLeft: INDENT * level + 'px' }}
            dangerouslySetInnerHTML={richText ? { __html: description } : undefined}
          >
            {richText ? null : description}
          </p>
        )}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
