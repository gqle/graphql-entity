import { AbsolutePath } from '@gqle/shared'
import { parse } from 'graphql'
import { compile, CompileParams } from '../compile'
import { printResults } from '../print'

export type GetCompilationFilesInput = [location: string, source: string][]

export const getCompilationFiles = async (input: GetCompilationFilesInput) => {
  const sources: CompileParams['sources'] = []

  for (const [location, source] of input) {
    sources.push({ document: parse(source), location: AbsolutePath.from(location) })
  }

  const compilation = await compile({ sources })

  return printResults({ ...compilation, rootOutputPath: AbsolutePath.from('/') })
}
