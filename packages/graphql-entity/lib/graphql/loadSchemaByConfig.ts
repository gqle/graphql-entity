import { GraphQLSchema, DocumentNode } from 'graphql'
import { buildSchemaFromTypeDefinitions } from '@graphql-tools/schema'
import { resolveConfig } from '../config/resolveConfig'
import { loadDocumentsFromGraphQLFiles } from './loadDocuments'

const rootTypes = /* GraphQL */ `
  type Query {
    _isExtended: Boolean
  }

  type Mutation {
    _isExtended: Boolean
  }

  type Subscription {
    _isExtended: Boolean
  }
`

export const loadSchemaByConfig = (): GraphQLSchema => {
  const { documents, includeRootTypes } = resolveConfig()

  const documentNodes = loadDocumentsFromGraphQLFiles(documents)
    .map((source) => source.document)
    .filter(Boolean) as (DocumentNode | string)[]

  if (includeRootTypes) {
    documentNodes.unshift(rootTypes)
  }

  return buildSchemaFromTypeDefinitions(documentNodes)
}
