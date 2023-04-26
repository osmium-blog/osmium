// @ts-ignore
const requireAsset = require.context('.', true, /^\.\/[\w-]+\.json$/, 'lazy')

/**
 * Lazy-load a locale data
 *
 * @param lang - The language name
 * @returns The content of a lang JSON
 */
export function loadLocale (lang: string): Promise<Osmium.LocaleData> {
  return requireAsset(`./${lang}.json`)
}

export const langs: [string, string][] = [
  ['en-US', 'English'],
  ['zh-CN', '中文（中国大陆）'],
]
