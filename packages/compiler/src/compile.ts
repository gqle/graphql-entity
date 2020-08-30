import { GraphQLSchema } from 'graphql/type'
import { DocumentNode } from 'graphql/language'
import { AbsolutePath } from '@gqle/shared'
import { EntityDocument } from './types'
import { Entity, Enum, Query } from './repr'

export interface CompileParams {
  schema?: GraphQLSchema
  sources: { document: DocumentNode; location: AbsolutePath }[]
}

export interface CompileResult {
  documents: EntityDocument[]
  queries: Query[]
}

export const compile = async ({
  schema: _schema,
  sources,
}: CompileParams): Promise<CompileResult> => {
  const documents: EntityDocument[] = []
  const queries: Query[] = []

  // TODO: For each type in our types map, get definitions from the schema
  for (const { document, location } of sources) {
    const entities: Entity[] = []
    const enums: Enum[] = []

    for (const definition of document.definitions) {
      switch (definition.kind) {
        case 'ObjectTypeDefinition':
          entities.push(Entity.fromObjectType(definition))
          break
        case 'ObjectTypeExtension':
          if (definition.name.value === 'Query') {
            queries.push(...Query.fromQueryExtension(definition))
          }
          // TODO: Other extensions
          break
        case 'EnumTypeDefinition':
          enums.push(Enum.fromEnum(definition))
          break
        default: {
          // TODO: Handle other definitions
        }
      }
    }

    documents.push({
      entities,
      enums,
      location,
    })
  }

  return {
    documents,
    queries,
  }
}
