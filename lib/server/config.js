const fs = require('fs')
const { resolve } = require('path')

const config = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'osmium-config.json'), 'utf-8'))

// If we need to stripe out some private fields
const clientConfig = config

module.exports = {
  config,
  clientConfig,
}
