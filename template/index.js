'use strict'
const create = require('@pkgjs/create')

module.exports = create({
  options: {
    hello: {
      description: 'Hello World',
      alias: 'h',
      type: 'string',
      default: 'world'
    }
  }
}, async (prompt, options) => {
  const opts = await prompt()

  // Use the opts
  console.log(`Hello ${opts.hello}!`)
})
