'use strict'
const create = require('../../..')
module.exports = create({
  options: {
    one: { type: 'number' }
  }
}, async (initOpts) => {
  const o = await initOpts()
  console.log('one', o.one)
})
