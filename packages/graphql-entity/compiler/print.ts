import { AbsolutePath } from '../lib/path'
import { EntityDocument } from './types'
import { RootExtension, RootExtensionKind } from './repr'
import { TSWriter } from './writer/TSWriter'
import { TSInterface } from './writer/TSFile'

const findDocumentContainingType = ({
  documents,
  typeName,
}: {
  documents: EntityDocument[]
  typeName: string
}): EntityDocument | null => {
  const document = documents.find((doc) => {
    return doc.entities.find((entity) => {
      return entity.name === typeName
    })
  })

  if (!document) {
    return null
  }

  return document
}

const rootExtensionsToInterface = ({
  name,
  extensions,
}: {
  name: string
  extensions: RootExtension[]
}): TSInterface => {
  return {
    name,
    values: extensions.map((e) => [`${e.name}()`, `Awaitable<${e.type.print()}>`]),
  }
}

export interface PrintResultsParams {
  documents: EntityDocument[]
  rootOutputPath: AbsolutePath
}

export const printResults = ({ documents, rootOutputPath }: PrintResultsParams): TSWriter => {
  const writer = TSWriter.create()

  for (const { entities, enums, location, rootExtensions } of documents) {
    const file = writer.file(location)

    // Add prelude
    file.addImport({ name: 'Maybe', path: 'graphql-entity/prelude' })

    // Add imports for referenced entities
    for (const entity of entities) {
      for (const field of entity.fields) {
        const typeName = field.type.getName()

        // TODO: Don't try to look up scalars
        const referencedDocument = findDocumentContainingType({ documents, typeName })
        if (referencedDocument) {
          file.addImport({ name: typeName, path: referencedDocument.location })
        }
      }
    }

    // Add definitions
    const definitions = file.section('Definitions')
    for (const definition of enums) {
      definitions.addEnum({
        name: definition.name,
        members: definition.members.map((name) => [name, name]),
      })
    }

    for (const definition of entities) {
      definitions.addInterface({
        name: definition.name,
        values: definition.fields.map((field) => [field.name, field.type.print()]),
      })
    }

    // Associate the entity type with the resolved type definition
    const entitySection = file.section('Entities')
    for (const definition of entities) {
      entitySection.addRaw(`export type ${definition.name}Entity = ${definition.name}\n`)
    }

    // Add root-type extensions which this document is responsible for
    if (rootExtensions.length) {
      file.addImport({ name: 'Awaitable', path: 'graphql-entity/prelude' })

      const extensionsSection = file.section('RootExtensions')
      extensionsSection.addInterface(
        rootExtensionsToInterface({ name: 'RootExtensions', extensions: rootExtensions })
      )
    }
  }

  // Print the server root
  const file = writer.file(rootOutputPath)
  file.addImport({ name: 'Awaitable', path: 'graphql-entity/prelude' })
  file.addImport({ name: 'Maybe', path: 'graphql-entity/prelude' })
  file.addImport({
    name: 'createEntityServer',
    alias: 'baseCreateEntityServer',
    path: 'graphql-entity',
  })

  // Collect entities
  for (const { location, entities } of documents) {
    for (const entity of entities) {
      file.addImport({ name: entity.name, alias: entity.importAs, path: location })
    }
  }

  const entitySection = file.section('Entities')
  const entityValues: [string, string][] = []

  for (const { entities } of documents) {
    for (const { name, importAs } of entities) {
      entityValues.push([name, importAs])
    }
  }

  entitySection.addInterface({
    name: 'Entities',
    values: entityValues,
  })

  // Print root type
  const rootExtensions = documents.reduce((extensions, doc) => {
    return extensions.concat(doc.rootExtensions)
  }, [] as RootExtension[])

  const querySection = file.section('Root')
  querySection.addInterface(rootExtensionsToInterface({ name: 'Root', extensions: rootExtensions }))

  // Add entity aliases
  const aliases = file.section('Aliases')
  aliases.addRaw('export type RootEntity = Root')

  // Add createEntityServer alias
  const server = file.section('Server')
  server.addRaw(
    'export const createEntityServer = (opts: { root: RootEntity }) =>\n  baseCreateEntityServer<RootEntity>(opts);'
  )

  return writer
}
