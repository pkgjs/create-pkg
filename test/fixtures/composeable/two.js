'use strict'
const create = require('../../..')
const genOne = require('./one')

module.exports = create({
  uses: [genOne],
  options: {
    two: { type: 'number' }
  }
}, async (initOpts) => {
  const o = await initOpts()
  await genOne(o)
  console.log('two', o.two)
})
