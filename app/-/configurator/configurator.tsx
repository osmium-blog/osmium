'use client'

import { get } from 'lodash'

import css from './page.module.scss'
import type { Schema, SchemaEntryData } from './assets/config-schema'
import TextInput from '@/components/ui/text-input'
import NumberInput from '@/components/ui/number-input'
import Switch from '@/components/ui/switch'
import ColorInput from '@/components/ui/color-input'
import Select from '@/components/ui/select'
import { useConfigurator } from './configurator.context'
import LocaleText from './locale-text'

type Props = {
  schema: Schema
}

export default function Configurator ({ schema }: Props) {
  return (
    <div className={css.configurator}>
      <EntryList prefix={[]} schema={schema}/>
    </div>
  )
}

type EntryListProps = {
  prefix: string[]
  schema: Schema
}

function EntryList ({ prefix, schema }: EntryListProps) {
  const { config } = useConfigurator()

  const entries = Object.entries(schema)

  return <>
    {entries.map(([name, data]) => (
      data.when && get(config, data.when[0]) !== data.when[1]
        ? null
        : data.type === 'group'
          ? <EntryGroup key={name} path={prefix.concat(name)} data={data}/>
          : <Entry key={name} path={prefix.concat(name)} data={data}/>
    ))}
  </>
}

const INDENT = 24

type EntryProps = {
  path: string[]
  data: SchemaEntryData
}

function Entry ({ path, data }: EntryProps) {
  return <>
    <div className={css.entry}>
      <code style={{ paddingLeft: INDENT * (path.length - 1) }}>{path.at(-1)}</code>
      <div>
        {'description' in data && (
          <p><LocaleText t={data.description!} tag={data.richText ? 'span' : undefined}/></p>
        )}
        <EntryEditor path={path} data={data}/>
      </div>
    </div>
  </>
}

type EntryGroupProps = {
  path: string[]
  data: SchemaEntryData & { type: 'group' }
}

function EntryGroup ({ path, data }: EntryGroupProps) {
  return (
    <div className={css.entry_group}>
      <Entry path={path} data={data}/>
      <EntryList prefix={path} schema={data.schema}/>
    </div>
  )
}

type EntryEditorProps = {
  path: string | string[]
  data: SchemaEntryData
}
function EntryEditor ({ path, data }: EntryEditorProps) {
  const { config, setConfig } = useConfigurator()
  const value = get(config, path)
  const setter = (value: unknown) => setConfig(path, value)

  switch (data.type) {
    case 'string':
      return <TextInput value={value} onChange={setter}/>
    case 'number':
      return <NumberInput value={value} onChange={setter}/>
    case 'boolean':
      return <Switch checked={Boolean(value)} onChange={setter}/>
    case 'list':
      return (
        <TextInput
          value={value.join(', ')}
          onChange={value => setter(value.split(/\s*,\s*/).filter(Boolean))}
        />
      )
    case 'color':
      return <ColorInput value={value} onChange={setter}/>
    case 'select':
      return (
        <Select value={value} onChange={setter}>
          {data.options.map(opt => {
            const [value, label] = typeof opt === 'string' ? [opt, opt] : opt
            return (
              <option key={value} value={value}>
                <LocaleText t={label}/>
              </option>
            )
          })}
        </Select>
      )
    case 'group':
      return null
    default:
      return <pre>{JSON.stringify(data, null, 2)}</pre>
  }
}
