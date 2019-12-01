'use strict'
const { suite, test } = require('mocha')
const assert = require('assert')
const path = require('path')
const pkg = require('../package.json')
const create = require('..')

const TMP_DIR = path.join(__dirname, 'fixtures', 'tmp')

suite(pkg.name, () => {
  test('options can come in many forms', async () => {
    const gen = create({
      promptor: async (prompts) => {
        // Assert we get the prompts we wanted
        assert.strictEqual(prompts[0].name, 'foo')
        assert.strictEqual(prompts[0].type, 'input')
        assert.strictEqual(prompts[0].default, 'bar')
        assert.strictEqual(prompts[1].name, 'baz')
        assert.strictEqual(prompts[1].type, 'list')
        assert.strictEqual(prompts[1].default, undefined)
        assert.deepStrictEqual(prompts[1].choices, ['fob', 'bob', 'foz'])
        assert.strictEqual(prompts[2].name, 'bool')
        assert.strictEqual(prompts[2].type, 'confirm')
        assert.strictEqual(prompts[2].default, undefined)
        return {
          foo: prompts[0].default,
          baz: 'fob'
        }
      },
      options: {
        foo: {
          description: 'Foo',
          default: 'bar'
        },
        baz: {
          description: 'Baz',
          type: 'string',
          prompt: {
            type: 'list',
            choices: ['fob', 'bob', 'foz']
          }
        },
        bool: {
          description: 'bool',
          type: 'boolean'
        }
      }
    }, async (initOpts) => {
      const o = await initOpts({
        override: true
      })
      assert.strictEqual(o.foo, 'bar')
      assert.strictEqual(o.baz, 'fob')
      assert.strictEqual(o.bool, undefined)
      assert.strictEqual(o.override, true)
      assert.strictEqual(o.directory, TMP_DIR)
    })
    assert(gen)

    // Run the generator
    await gen({
      directory: TMP_DIR
    })
  })

  test('generators are composable', async () => {
    const genOne = create({
      options: {
        one: { type: 'number' }
      },
      initOptions: (input) => {
        return { one: 'one' }
      }
    }, async (initOpts) => {
      const o = await initOpts()
      assert.strictEqual(o.one, 'one')
      assert.strictEqual(o.directory, TMP_DIR)
    })

    const genTwo = create({
      uses: [genOne],
      options: {
        two: { type: 'number' }
      }
    }, async (initOpts) => {
      const o = await initOpts()
      assert.strictEqual(o.one, 'one')
      assert.strictEqual(o.two, 2)
      assert.strictEqual(o.directory, TMP_DIR)
      assert.strictEqual(o.prompt, false)

      await genOne(o)
    })

    // JS api
    await genTwo({
      directory: TMP_DIR,
      prompt: false,
      one: 1,
      two: 2
    })
  })
})
