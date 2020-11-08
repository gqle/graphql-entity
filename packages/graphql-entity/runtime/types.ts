import { AbsolutePath } from '../lib/path'

export interface GqleConfigOptions {
  documents: string | string[]
  rootOutputPath: string
  outputPath: string
}

export interface GqleResolvedConfig {
  documents: AbsolutePath | AbsolutePath[]
  rootOutputPath: AbsolutePath
  outputPath: AbsolutePath
  configDir: AbsolutePath
}
