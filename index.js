'use strict'
const yargs = require('yargs/yargs')
const inquirer = require('inquirer')

module.exports = function (opts = {}, runner) {
  // Prompts implementation is injectable
  const promptor = opts.promptor || inquirer.prompt

  // Options we create by default for all create-* packags
  const defaultOptions = {
    prompt: {
      description: 'Prompts, --no-prompt to use defaults and input only',
      type: 'boolean',
      prompt: false,
      flag: {
        key: 'no-prompt'
      }
    },
    directory: {
      description: 'Working directory',
      default: process.cwd(),
      type: 'string',
      prompt: false,
      flag: {
        alias: 'd'
      }
    },
    silent: {
      description: 'Suppress all output',
      type: 'boolean',
      prompt: false,
      flag: {
        alias: 'S'
      }
    }
  }

  // Mix-in options from used generators
  const mixedInOptions = (opts.uses || []).reduce((obj, gen) => {
    return Object.entries(gen.options)
      .reduce((obj, [key, val]) => {
        obj[key] = val
        return obj
      }, obj)
  }, {})

  // Merge the options together
  const allOptions = { ...defaultOptions, ...mixedInOptions, ...opts.options }
  const optionKeys = Object.keys(allOptions)
  const defaults = {}

  // Process options
  optionKeys.forEach((key) => {
    const desc = allOptions[key]
    if (typeof desc.default !== 'undefined') {
      defaults[key] = desc.default
    }
  })

  async function run (input = {}) {
    // Removed undefined values from input and default some options
    const options = Object.keys(input).reduce((o, key) => {
      if (typeof input[key] !== 'undefined') {
        o[key] = input[key]
      }
      return o
    }, { ...defaults })

    async function initOptions (overrides) {
      const _opts = Object.assign({}, options, overrides)
      if (_opts.prompt === false) {
        return _opts
      }

      // Create a prompt for each option
      const prompts = Object.entries(allOptions).reduce((p, [key, o]) => {
        if (o.prompt === false) {
          return p
        }

        // Type based input type
        let type
        switch (o.type) {
          case 'boolean':
            type = 'confirm'
            break
          case 'number':
            type = 'number'
            break
          default:
            type = 'input'
        }

        const defaultPrompt = {
          name: key,
          type: type,
          message: `${o.message || o.description || key}:`,
          default: _opts[key],
          when: typeof input[key] === 'undefined'
        }

        // Use provided prompt config
        if (typeof o.prompt === 'object') {
          p.push({
            ...defaultPrompt,
            ...o.prompt
          })
          return p
        }

        p.push(defaultPrompt)
        return p
      }, [])

      return Object.assign({}, _opts, await promptor(prompts))
    }

    const ret = await runner(initOptions)
    return ret
  }

  run.options = allOptions

  run.cli = (argv) => {
    // Cli setup
    const cli = yargs(argv)
      .usage(opts.usage || '$0', opts.commandDescription || 'Run a create-* package', () => {}, run)

    if (opts.scriptName) {
      cli.scriptName(opts.scriptName)
    }

    // Process options
    optionKeys.forEach((key) => {
      const desc = allOptions[key]
      if (desc.flag === false) {
        return
      }

      cli.option((desc.flag && desc.flag.key) || key, {
        description: desc.description,
        type: desc.type,
        ...desc.flag
      })
    })

    return cli.argv
  }

  return run
}
