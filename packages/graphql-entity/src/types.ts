import { AbsolutePath } from '@gqle/shared'

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
