import { GraphQLSchema, graphql } from 'graphql'
import { loadSchemaByConfig } from '../lib/graphql/loadSchemaByConfig'

export interface EntityServerOptions<TRoot = any> {
  schema: GraphQLSchema
  root: TRoot
}

export interface CreateEntityServerOptions<TRoot = any> {
  root: TRoot
}

export interface RunQueryOptions {
  query: string
  variables?: Record<string, unknown>
}

export class EntityServer<TRoot = any> {
  private schema: GraphQLSchema
  private root: TRoot

  constructor({ schema, root }: EntityServerOptions) {
    this.schema = schema
    this.root = root
  }

  async run({ query, variables }: RunQueryOptions) {
    return graphql(this.schema, query, this.root, null, variables)
  }
}

export const createEntityServer = <TRoot = any>({
  root,
}: CreateEntityServerOptions): EntityServer => {
  const schema = loadSchemaByConfig()

  return new EntityServer<TRoot>({ schema, root })
}
