import { Feed } from 'feed'
import ReactDOMServer from 'react-dom/server'
import { clientConfig, config } from '@/lib/server/config'
import getPage from '@/lib/server/notion-api/getPage'
import { ConfigProvider } from '@/contexts/config'
import NotionRenderer from '@/components/NotionRenderer'

const createFeedContent = async post => {
  const content = ReactDOMServer.renderToString(
    <ConfigProvider value={clientConfig}>
      <NotionRenderer recordMap={await getPage(post.id)}/>,
    </ConfigProvider>
  )
  // FIXME: Need a better solution
  const regexExp = /<div class="notion-collection-row"><div class="notion-collection-row-body"><div class="notion-collection-row-property"><div class="notion-collection-column-title"><svg.*?class="notion-collection-column-title-icon">.*?<\/svg><div class="notion-collection-column-title-body">.*?<\/div><\/div><div class="notion-collection-row-value">.*?<\/div><\/div><\/div><\/div>/g
  return content.replace(regexExp, '')
}

export async function generateRss (posts) {
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: config.title,
    description: config.description,
    // FIXME: Need to normalize
    id: `${config.link}/${config.path || ''}`,
    link: `${config.link}/${config.path || ''}`,
    language: config.lang,
    favicon: `${config.link}/favicon.svg`,
    copyright: `All rights reserved ${year}, ${config.author}`,
    author: {
      name: config.author,
      email: config.email,
      link: config.link,
    },
  })
  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${config.link}/${post.slug}`,
      link: `${config.link}/${post.slug}`,
      description: post.summary,
      content: await createFeedContent(post),
      date: new Date(post.date),
    })
  }
  return feed.atom1()
}
