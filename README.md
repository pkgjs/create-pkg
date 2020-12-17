# Scaffold a Package

[![NPM Version](https://img.shields.io/npm/v/create-pkg.svg)](https://npmjs.org/package/create-pkg)
[![NPM Downloads](https://img.shields.io/npm/dm/create-pkg.svg)](https://npmjs.org/package/create-pkg)
[![test](https://github.com/pkgjs/create/workflows/Node.js%20CI/badge.svg)](https://github.com/pkgjs/create/actions?query=workflow%3A%22Node.js+CI%22)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard)

## Usage

```
$ npm init pkg

# or

$ npx create-pkg

# or

$ npm install -g create-pkg
$ create-pkg
```

### CLI Usage

```
$ create-pkg --help
create-git

initalize a package

Options:
  --help                        Show help                              [boolean]
  --version                     Show version number                    [boolean]
  --cwd, -d                     Directory to run in     [default: process.cwd()]
  # TODO
```

### Programmatic Usage

```javascript
const createPkg = require('@pkgjs/create-pkg')

await createPkg({
  // TODO
})
```

#### Composition with other `create-*` packages

This generator is built on top of `opta`, a helper library for collecting
user input from multiple interfaces: CLI via `yargs`, interactive prompts via `inquirer`
and via a JS interface.  To compose with other `opta` based input collection,
you can use `.options` to access the cli/prompt/js configurations.

```javascript
const createPkg = require('create-pkg')
const opta = require('opta')

const opts = opta({
  commandDescription: 'Your description',
  options: {
    // Spread the options from createGPkg
    ...createPkg.options,
  }
})

// Our generator main
module.exports = async function (input) {
  // Add our input as overrides on the opta instance
  options.overrides(input)

  // Prompt the user,
  await options.prompt()

  // Get the current values from the opta instance
  let opts = options.values()

  // Call create git
  await createPkg(opts)
}
```

For more information check out the [docs for `opta`](https://www.npmjs.com/package/opta).
