import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

const requireLayout = require.context('.', true, /^\.\/\w+\/index\.tsx$/, 'lazy')

/**
 * Lazy-load a layout
 *
 * @param {string} name - The name of the layout
 * @returns {*}
 */
function loadLayout (name) {
  return requireLayout(`./${name}/index.tsx`)
}

export default function Layout ({ name, children }) {
  const Layout = dynamic(() => loadLayout(name))
  return <Layout>{children}</Layout>
}

Layout.propsType = {
  name: PropTypes.string.isRequired,
}
