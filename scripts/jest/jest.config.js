const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../'),
  projects: ['<rootDir>/packages/*', '<rootDir>/examples/*'],
}
