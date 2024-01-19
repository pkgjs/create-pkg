'use strict'
const { suite, test } = require('mocha')
const assert = require('assert')
const pkg = require('../package.json')
const mod = require('..')

suite(pkg.name, () => {
  test('...', () => {
    assert(mod)
  })
})
