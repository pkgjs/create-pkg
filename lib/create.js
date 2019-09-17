'use strict'
const path = require('path')
const fs = require('fs').promises
const create = require('../')

const TMPL_DIR = path.join(__dirname, '..', 'template')

module.exports = create({
  scriptName: '@pkgjs/create',
  commandDescription: 'Scaffold a create-* package',
  options: {
    name: {
      description: 'Package name',
      alias: 'n',
      type: 'string'
    },
    editPackage: {
      description: 'Edit package.json',
      type: 'boolean',
      default: false
    }
  }
}, async (initOpts) => {
  const o = await initOpts()

  // Write files
  await fs.mkdir(path.join(o.directory, 'bin'), {
    recursive: true
  })
  await fs.copyFile(path.join(TMPL_DIR, 'index.js'), path.join(o.directory, 'index.js'))
  await fs.copyFile(path.join(TMPL_DIR, 'bin', 'create'), path.join(o.directory, 'bin', `create-${o.name}`))

  if (o.editPackage) {
    console.log('run create-pacakge-json')
  }
})
