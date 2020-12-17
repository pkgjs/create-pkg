'use strict'
const path = require('path')
const opta = require('opta')
const createPackageJson = require('create-package-json')
const createGit = require('create-git')
const cptmpl = require('cptmpl')
const { Loggerr } = require('loggerr')

function initOpts () {
  return opta({
    commandDescription: 'Generate a package.json',
    options: {
      cwd: {
        description: 'Directory to run in',
        prompt: false,
        flag: {
          alias: 'd',
          defaultDescription: 'process.cwd()'
        }
      },

      silent: {
        type: 'boolean',
        prompt: false,
        flag: {
          conflicts: ['verbose']
        }
      },
      verbose: {
        type: 'boolean',
        prompt: false,
        flag: {
          conflicts: ['silent']
        }
      },

      // First ask the package questions
      ...createPackageJson.options,

      // Add our additional prompts
      githubOrg: {
        default: 'pkgjs',
        prompt: {
          message: 'GitHub User/Org:'
        }
      },
      githubRepo: {
        flag: {
          key: 'github-repo'
        },
        prompt: {
          message: 'GitHub repo:',
          default: (promptInput, allInput) => {
            // Remove the scope from the package name
            return allInput.name && allInput.name.replace(/^@[^/]+\//, '')
          }
        }
      },

      ...createGit.options,

      // Override createGit.options.remoteOrigin
      remoteOrigin: {
        ...createGit.options.remoteOrigin,
        prompt: {
          ...createGit.options.remoteOrigin.prompt,
          default: (promptInput, allInput) => {
            return `git@github.com:${allInput.githubOrg}/${allInput.githubRepo}.git`
          }
        }
      }
    }
  })
}

module.exports = main
async function main (input, _opts = {}) {
  const options = initOpts()
  options.overrides({
    ...input,
    cwd: input.cwd || process.cwd(),

    // My opinionated overrides
    version: '0.0.0',
    devDependencies: ['standard', 'mocha'],
    additionalRules: ['package-lock.json']
  })

  let opts = options.values()

  const log = _opts.logger || new Loggerr({
    level: (opts.silent && 'silent') || (opts.verbose && 'debug') || 'info',
    formatter: 'cli'
  })

  await options.prompt({
    promptor: _opts.promptor
  })()

  opts = options.values()

  // do stuff
  await cptmpl.recursive(tmplPath(), opts.cwd, opts)
  await createPackageJson(opts, {
    promptor: _opts.promptor,
    logger: log
  })
  await createGit(opts, {
    promptor: _opts.promptor,
    logger: log
  })
}

function tmplPath (...args) {
  return path.join(__dirname, 'templates', ...args)
}

module.exports.options = initOpts().options
module.exports.cli = function () {
  return initOpts().cli((yargs) => {
    yargs.command('$0', 'Generate a package', () => {}, main)
  })
}
