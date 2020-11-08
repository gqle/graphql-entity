import { GraphQLSchema, DocumentNode } from 'graphql'
import { buildSchemaFromTypeDefinitions } from '@graphql-tools/schema'
import { resolveConfig } from '../config/resolveConfig'
import { loadDocumentsFromGraphQLFiles } from './loadDocuments'

export const loadSchemaByConfig = (): GraphQLSchema => {
  const { documents } = resolveConfig()

  const documentNodes = loadDocumentsFromGraphQLFiles(documents)
    .map((source) => source.document)
    .filter(Boolean) as DocumentNode[]

  return buildSchemaFromTypeDefinitions(documentNodes)
}
