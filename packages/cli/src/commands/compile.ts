import * as path from 'path'
import { DocumentNode } from 'graphql/language'
import { Command } from '@oclif/command'
import { AbsolutePath, ensureDirectory, Path, writeStringToFile } from '@gqle/shared'
import { resolveConfig, loadDocumentsFromGraphQLFiles } from '@gqle/graphql-entity'
import { compile, printResults } from '@gqle/compiler'

export default class Compile extends Command {
  static description = 'perform a compilation'

  async run() {
    const config = resolveConfig()

    const documents = loadDocumentsFromGraphQLFiles(config.documents)

    // Create input and output paths for all sources
    let sources: { document: DocumentNode; location: AbsolutePath }[] = []
    for (const { document, location } of documents) {
      if (!document || !location) {
        continue
      }

      // Do substitution on the output path based on the location
      let outputLocation = config.outputPath.path
      const dirpath = config.configDir.pathTo(AbsolutePath.from(path.dirname(location)))
      while (outputLocation.includes('[dirpath]')) {
        outputLocation = outputLocation.replace('[dirpath]', dirpath.path)
      }
      while (outputLocation.includes('[dirname]')) {
        outputLocation = outputLocation.replace('[dirname]', path.basename(path.dirname(location)))
      }
      while (outputLocation.includes('[filename]')) {
        outputLocation = outputLocation.replace('[filename]', path.basename(location.split('.')[0]))
      }

      sources.push({ document, location: config.configDir.resolveTo(Path.from(outputLocation)) })
    }

    const compilation = await compile({ sources })

    const { files } = printResults({
      documents: compilation.documents,
      rootOutputPath: config.rootOutputPath,
    })

    for (const file of files) {
      await ensureDirectory(AbsolutePath.from(path.dirname(file.filepath.path)))
      await writeStringToFile(file.filepath, file.write())
    }
  }
}
