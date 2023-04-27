import type { UIEvent } from 'react'

/**
 * A simplified version of `Lodash.get()`
 */
export function get<T, O extends Record<string, any>> (obj: O, keyPath: string | string[], defValue: T) {
  if (typeof keyPath === 'string') {
    keyPath = keyPath.split('.')
  }
  let current = obj
  for (const key of keyPath) {
    current = current?.[key]
    if (current == null) break
  }
  return current === undefined ? defValue : current
}

/**
 * A simplified version of `Lodash.set()`
 */
export function set<T, O extends Record<string, any>> (obj: O, keyPath: string | string[], value: T) {
  if (typeof keyPath === 'string') {
    keyPath = keyPath.split('.')
  }
  keyPath = keyPath.slice()
  const lastKey = keyPath.pop()!
  let current: any = obj
  for (const key of keyPath) {
    current[key] ??= {}
    current = current[key]
  }
  current[lastKey] = value
  return obj
}

/**
 * Stupidly clone a JSON object
 */
export function clone<O> (obj: O): O {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Simple template interpolation
 */
export function execTemplate (template: string, vars: Record<string, string>): string {
  return template.replaceAll(/\{(\S+?)}/g, (_, p) => vars[p] || p)
}

/**
 * Auto-call `.preventDefault()`
 */
export function prevent<E extends UIEvent> (cb: (ev: E) => any) {
  return (ev: E) => {
    ev.preventDefault()
    cb(ev)
  }
}

/**
 * Auto-call `.stopPropagation()`
 */
export function stopPropa<E extends UIEvent> (cb: (ev: E) => any) {
  return (ev: E) => {
    ev.stopPropagation()
    cb(ev)
  }
}
