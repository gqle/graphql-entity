import * as path from 'path'
import * as findUp from 'find-up'
import { AbsolutePath, Path } from '@gqle/shared'
import { GqleConfigOptions, GqleResolvedConfig } from '../types'

export const resolveConfig = (): GqleResolvedConfig => {
  // TODO: Accept config via -c flag
  const configPath = findUp.sync('gqle.config.js')

  if (!configPath) {
    throw new Error('Could not locate `gqle.config.js`')
  }

  // Resolve paths in the config relative to it
  const configDir = AbsolutePath.from(path.dirname(configPath))
  const configPathToAbsolute = (path: string): AbsolutePath => configDir.resolveTo(Path.from(path))

  const config: GqleConfigOptions = require(configPath)

  const documents =
    typeof config.documents === 'string'
      ? configPathToAbsolute(config.documents)
      : config.documents.map(configPathToAbsolute)

  return {
    documents,
    outputPath: configPathToAbsolute(config.outputPath),
    rootOutputPath: configPathToAbsolute(config.rootOutputPath),
    configDir,
  }
}
