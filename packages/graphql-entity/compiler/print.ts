import { AbsolutePath } from '../lib/path'
import { EntityDocument } from './types'
import { Field, RootExtension } from './repr'
import { TSWriter } from './writer/TSWriter'
import { TSInterface } from './writer/TSFile'
import { capitalizeInitial } from '../lib/string'

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

/**
 * Get a TSInterface describing parameters for a field
 */
const parametersInterface = ({ field }: { field: Field }): TSInterface => {
  return {
    name: `${capitalizeInitial(field.name)}Parameters`,
    values: field.parameters.map(([name, type]) => [name, type.getName()]),
  }
}

/**
 * Get TSInterfaces describing parameters for a list of fields
 */
const parametersFromFields = ({ fields }: { fields: Field[] }): TSInterface[] => {
  const interfaces: TSInterface[] = []

  for (const extension of fields) {
    if (extension.parameters.length) {
      interfaces.push(parametersInterface({ field: extension }))
    }
  }

  return interfaces
}

/**
 * Get a TSInterface encapsulating a list of fields
 */
const fieldsToInterface = ({ name, fields }: { name: string; fields: Field[] }): TSInterface => {
  return {
    name,
    values: fields.map((field) => {
      const type = field.parameters.length
        ? `Resolvable<${field.type.print()}, ${capitalizeInitial(field.name)}Parameters>`
        : `Resolvable<${field.type.print()}>`

      return [field.name, type]
    }),
  }
}

export interface PrintResultsParams {
  documents: EntityDocument[]
  rootOutputPath: AbsolutePath
}

export const printResults = ({ documents, rootOutputPath }: PrintResultsParams): TSWriter => {
  const writer = TSWriter.create()

  for (const { entities, enums, inputs, location, rootExtensions } of documents) {
    const file = writer.file(location)

    // Add prelude
    file.addImport({ name: 'Awaitable', path: 'graphql-entity/prelude' })
    file.addImport({ name: 'Maybe', path: 'graphql-entity/prelude' })
    file.addImport({ name: 'Resolvable', path: 'graphql-entity/prelude' })

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

    for (const input of inputs) {
      definitions.addInterface({
        name: input.name,
        values: input.fields.map((field) => [field.name, field.type.print()]),
        comment: 'Input',
      })
    }

    for (const definition of entities) {
      definitions.addInterface(
        fieldsToInterface({
          name: definition.name,
          fields: definition.fields,
        })
      )
    }

    // Associate the entity type with the resolved type definition
    const entitySection = file.section('Entities')
    for (const definition of entities) {
      entitySection.addRaw(`export type ${definition.name}Entity = ${definition.name}\n`)
    }

    // Add root-type extensions which this document is responsible for
    if (rootExtensions.length) {
      const extensionsSection = file.section('RootExtensions')

      for (const parameters of parametersFromFields({ fields: rootExtensions })) {
        extensionsSection.addInterface(parameters)
      }

      extensionsSection.addInterface(
        fieldsToInterface({ name: 'RootExtensions', fields: rootExtensions })
      )
    }
  }

  // Print the server root
  const file = writer.file(rootOutputPath)
  file.addImport({ name: 'Awaitable', path: 'graphql-entity/prelude' })
  file.addImport({ name: 'Maybe', path: 'graphql-entity/prelude' })
  file.addImport({ name: 'Resolvable', path: 'graphql-entity/prelude' })
  file.addImport({
    name: 'createEntityServer',
    alias: 'baseCreateEntityServer',
    path: 'graphql-entity',
  })

  // Collect entities and parameters
  for (const { location, entities, rootExtensions } of documents) {
    for (const entity of entities) {
      file.addImport({ name: entity.name, alias: entity.importAs, path: location })
    }
    // Import parameters definitions for root extensions
    for (const { name } of parametersFromFields({ fields: rootExtensions })) {
      file.addImport({ name, path: location })
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
  querySection.addInterface(
    fieldsToInterface({
      name: 'Root',
      fields: rootExtensions,
    })
  )

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
