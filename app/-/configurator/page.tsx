import LangSelect from './lang-select'
import LocaleText from './locale-text'
import Configurator from './configurator'

export default function Page () {
  return (
    <div className="p-8 text-night dark:text-day relative">
      <LangSelect className="inline-block"/>
      <LocaleText t="configurator.description" tag="p" className="my-7"/>
      <Configurator/>
    </div>
  )
}
