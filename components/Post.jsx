import PropTypes from 'prop-types'
import cn from 'classnames'
import { useConfig } from '@/lib/config'
import useTheme from '@/lib/theme'
import UserAvatar from '@/components/UserAvatar'
import FormattedDate from '@/components/FormattedDate'
import TagItem from '@/components/TagItem'
import NotionRenderer from '@/components/NotionRenderer'
import TableOfContents from '@/components/TableOfContents'

/**
 * A post renderer
 *
 * @param {PostProps} props
 *
 * @typedef {object} PostProps
 * @prop {object}   post       - Post metadata
 * @prop {object}   blockMap   - Post block data
 */
export default function Post (props) {
  const BLOG = useConfig()
  const { post, blockMap } = props
  const { dark } = useTheme()

  return (
    <article className={cn('grid grid-cols-[0_1fr_0]', post.fullWidth ? 'md:grid-cols-[80px_minmax(0,calc(var(--content-width)-80px*2))_auto]' : 'md:grid-cols-[1fr_42rem_1fr]')}>
      <div className="row-start-1 col-start-2 px-4">
        <h1 className={cn('font-bold text-3xl text-black dark:text-white')}>{post.title}</h1>
        {post.type[0] !== 'Page' && (
          <nav className={cn('w-full flex mt-7 items-start text-gray-500 dark:text-gray-400')}>
            <div className="flex mb-4">
              <a href={BLOG.socialLink || '#'} className="flex">
                <UserAvatar className="rounded-full"/>
                <p className="ml-2 md:block">{BLOG.author}</p>
              </a>
              <span className="block">&nbsp;/&nbsp;</span>
            </div>
            <div className="mr-2 mb-4 md:ml-0">
              <FormattedDate date={post.date}/>
            </div>
            {post.tags && (
              <div className="flex flex-nowrap max-w-full overflow-x-auto article-tags">
                {post.tags.map(tag => (
                  <TagItem key={tag} tag={tag}/>
                ))}
              </div>
            )}
          </nav>
        )}
      </div>
      <div className={cn('row-start-3 lg:row-start-2 col-start-2 px-4')}>
        <NotionRenderer recordMap={blockMap} fullPage={false} darkMode={dark}/>
      </div>
      <div className={cn('row-start-2 col-start-2 lg:col-start-3 px-4 lg:px-0', { 'lg:min-w-[160px] lg:max-w-[320px]': post.fullWidth })}>
        {/* `65px` is the height of expanded nav */}
        {/* Plus 16px to keep margin */}
        {/* TODO: Remove the magic number */}
        <TableOfContents blockMap={blockMap} className="lg:inline-block sticky lg:mr-4" style={{ top: 65 + 16 + 'px' }}/>
      </div>
    </article>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  blockMap: PropTypes.object.isRequired,
}
