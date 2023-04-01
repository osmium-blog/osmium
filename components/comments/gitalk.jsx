import 'gitalk/dist/gitalk.css'
import GitalkComponent from 'gitalk/dist/gitalk-component'

export default function Gitalk ({ config, post }) {
  return (
    <GitalkComponent options={{ id: post.id, title: post.title, ...config }}/>
  )
}
