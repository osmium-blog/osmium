import { useRouter } from 'next/router'
import Link from 'next/link'
import cn from 'classnames'

import css from './styles.module.scss'
import type { PageMeta } from '@/lib/server/page'
import { useData } from '@/contexts/data'

const INDENT = 24

type Node = PageMeta & { children?: Node[] }

export default function LayoutNav () {
  const { current, pages, pageMap } = useData()

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
    if (page.parent) {
      let parent = nodeMap[page.parent]
      if (parent) {
        parent.children ??= []
        parent.children.push(node)
      } else {
        nodeMap[page.parent] = { children: [node] } as any
      }
    } else {
      roots.push(node)
    }

    return data
  }, { nodeMap: {}, roots: [] })

  let currentRoot: PageMeta
  const navNodes: Node[] = current && (currentRoot = getRoot(current, pageMap))
    ? roots.find(n => n.hash === currentRoot.hash)?.children ?? []
    : roots.filter(n => ['Post', 'Doc'].includes(n.type!))

  return (
    <ul className={css.nav_root}>
      {navNodes.map(node => (
        <li key={node.id} className={cn(css.nav_item, { [css.nav_group]: node.children?.length })}>
          <NavItem node={node}/>
        </li>
      ))}
    </ul>
  )
}

function getRoot (page: PageMeta, pageMap: Record<string, PageMeta>): PageMeta {
  let current = page
  while (current.parent) {
    current = pageMap[current.parent]
  }
  return current
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
  const indentStyle = { paddingLeft: INDENT * level }

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
      ? (
        <Link href={href} target={isExternal ? '_blank': undefined} className={className}>
          <span style={indentStyle}>{node.title}</span>
        </Link>
      )
      : <span className={className} style={indentStyle}>{node.title}</span>
    }
    {children}
  </>
}
