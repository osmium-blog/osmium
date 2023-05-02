import { useEffect, useRef } from 'react'
import type { CodeBlock } from 'notion-types'
import { getTextContent } from 'notion-utils'
import { Code } from 'react-notion-x/build/third-party/code'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-js-templates'
import 'prismjs/components/prism-coffeescript'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-handlebars'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-makefile'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-objectivec'
import 'prismjs/components/prism-ocaml'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-reason'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-solidity'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-stylus'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-wasm'
import 'prismjs/components/prism-yaml'
import { useCopyToClipboard } from 'react-use'

type Props = {
  block: CodeBlock
  defaultLanguage?: string
  className?: string
}

export default function CodeBlock (props: Props) {
  const content = getTextContent(props.block.properties.title)
  const [state, copyToClipboard] = useCopyToClipboard()
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (state.error) return

    button.current!.dataset.success = 'true'
    const timer = setTimeout(() => {
      delete button.current!.dataset.success
    }, 2000)

    return () => clearTimeout(timer)
  }, [state])

  function copy () {
    copyToClipboard(content)
  }

  return (
    <div className="osmium-code">
      <button ref={button} type="button" className="copy-button" onClick={copy}>
        <i/>
      </button>
      <Code {...props}/>
    </div>
  )
}
