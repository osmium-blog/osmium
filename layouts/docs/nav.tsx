import Link from 'next/link'

import css from './styles.module.scss'
import type { PageMeta } from '@/lib/server/page'
import cn from 'classnames'
import { useRouter } from 'next/router'

const INDENT = 24

type Node = PageMeta & { children?: Node[] }

export default function LayoutNav ({ pages }: { pages: PageMeta[] }) {
  type ReduceData = {
    nodeMap: Record<string, Node>
    roots: Node[]
  }
  const { roots } = pages.reduce<ReduceData>((data, page) => {
    const { nodeMap, roots } = data

    let node: Node
    if (nodeMap[page.id]) {
      node = Object.assign(nodeMap[page.id], page)
    } else {
      node = nodeMap[page.id] = { ...page }
    }
    if (page.parent?.length) {
      let parent = nodeMap[page.parent[0]]
      if (parent) {
        parent.children ??= []
        parent.children.push(node)
      } else {
        nodeMap[page.parent[0]] = { children: [node] } as any
      }
    } else {
      roots.push(node)
    }

    return data
  }, { nodeMap: {}, roots: [] })

  return (
    <ul className={css.nav_root}>
      {roots.map(node => (
        <li key={node.id} className={cn(css.nav_item, { [css.nav_group]: node.children?.length })}>
          <NavItem node={node}/>
        </li>
      ))}
    </ul>
  )
}

type NavItemProps = {
  node: Node
  level?: number
}

function NavItem ({ node, level = 0 }: NavItemProps) {
  const router = useRouter()

  let href: string | null = null
  let isExternal = false
  switch (true) {
    case /^https?:\/\//.test(node.slug ?? ''):
      href = node.slug!
      isExternal = true
      break
    case node.hasContent:
      href = '/' + (node.slug || node.hash)
      break
  }
  const className = cn(css.nav_item_label, {
    [css.is_active]: router.asPath === href,
    [css.is_external]: isExternal,
  })
  const style = { paddingLeft: INDENT * level }

  const children = node.children?.length && (
    <ul>
      {node.children.map(child => (
        <li key={child.id} className={css.nav_item}>
          <NavItem node={child} level={level + 1}/>
        </li>
      ))}
    </ul>
  )

  return <>
    {href
      ? <Link href={href} target={isExternal ? '_blank': undefined} className={className} style={style}>{node.title}</Link>
      : <span className={className} style={style}>{node.title}</span>
    }
    {children}
  </>
}
