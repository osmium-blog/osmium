import css from './page.module.scss'
import { schema } from './assets/config-schema'
import LangSelect from './lang-select'
import LocaleText from './locale-text'
import Configurator from './configurator'

export default function Page () {
  return (
    <div className={css.page}>
      <section className={css.configurator_header}>
        <LangSelect className={css.configurator_lang_selector}/>
        <LocaleText t="configurator.description" tag="p" className={css.configurator_description}/>
      </section>
      <Configurator schema={schema}/>
    </div>
  )
}
