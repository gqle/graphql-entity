import { AbsolutePath } from './path'

export interface GqleConfigOptions {
  documents: string | string[]
  rootOutputPath: string
  outputPath: string
  includeRootTypes?: boolean
}

export interface GqleResolvedConfig {
  documents: AbsolutePath | AbsolutePath[]
  rootOutputPath: AbsolutePath
  outputPath: AbsolutePath
  configDir: AbsolutePath
  includeRootTypes: boolean
}
