import { AbsolutePath } from '@gqle/shared'
import { EntityDocument } from './types'
import { RootExtension, RootExtensionKind } from './repr'
import { TSWriter } from './writer/TSWriter'

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

export interface PrintResultsParams {
  documents: EntityDocument[]
  rootExtensions: RootExtension[]
  rootOutputPath: AbsolutePath
}

export const printResults = ({
  documents,
  rootExtensions,
  rootOutputPath,
}: PrintResultsParams): TSWriter => {
  const writer = TSWriter.create()

  for (const { entities, enums, location } of documents) {
    const file = writer.file(location)

    // Add prelude
    file.addImport({ name: 'Maybe', path: '@gqle/graphql-entity/dist/prelude' })

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
  }

  // Print the server root
  const file = writer.file(rootOutputPath)
  file.addImport({ name: 'Awaitable', path: '@gqle/graphql-entity/dist/prelude' })
  file.addImport({ name: 'Maybe', path: '@gqle/graphql-entity/dist/prelude' })
  file.addImport({
    name: 'createEntityServer',
    alias: 'baseCreateEntityServer',
    path: '@gqle/graphql-entity',
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
  const querySection = file.section('Root')
  querySection.addInterface({
    name: 'Root',
    values: rootExtensions.map((e) => [`${e.name}()`, `Awaitable<${e.type.print()}>`]),
  })

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
