const path = require('path')
const parseArgs = require('minimist')
const { exec } = require('child-process-promise')

const publicPackages = ['graphql-entity']
const verdaccioRegistryUrl = 'http://localhost:4873'

const { dry, verdaccio: isLocal } = parseArgs(process.argv.slice(2), {
  boolean: ['dry', 'verdaccio'],
})

const run = async (cmd) => {
  console.log(cmd)
  if (!dry) {
    await exec(cmd)
  }
}

const main = async () => {
  // Start in root directory
  const rootDir = path.resolve(__dirname, '../../')
  process.chdir(rootDir)

  try {
    await run('yarn install --pure-lockfile')
    await run('yarn run build')

    for (const package of publicPackages) {
      const packageDir = path.resolve(rootDir, 'packages', package)
      console.log(`-- ${packageDir}`)
      process.chdir(packageDir)

      if (isLocal) {
        await run(`npm unpublish --force --registry ${verdaccioRegistryUrl}`)
      }

      const publish = isLocal ? `npm publish --registry ${verdaccioRegistryUrl}` : 'npm publish'
      await run(publish)
    }
  } catch (err) {
    console.log({ err })
    process.exit(1)
  }
}

main()
