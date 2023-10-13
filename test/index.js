'use strict'
const { suite, test, before } = require('mocha')
const pkg = require('../package.json')
const fixtures = require('fs-test-fixtures')
const createPackage = require('..')
const fromEntries = require('object.fromentries')

const barePrompt = {
  promptor: () => async (prompts) => {
    // Set defaults from prompts
    const out = await Promise.all(prompts.map(async (p) => {
      if (!p.when) {
        return []
      }
      let ret = typeof p.default === 'function' ? p.default({}) : p.default
      if (ret && typeof ret.then === 'function') {
        ret = await ret
      }
      return [p.name, ret]
    }))

    return fromEntries(out)
  }
}

suite(pkg.name, () => {
  let fix
  before(() => {
    fix = fixtures()
  })

  test('scaffolds a package', async function () {
    await fix.setup()
    await createPackage({
      cwd: fix.TMP,
      push: false,
      silent: true,
      githubRepo: '__tmp',
      author: 'Unit test'
    }, barePrompt)
  })
})
