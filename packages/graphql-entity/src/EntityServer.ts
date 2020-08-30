import { GraphQLSchema, graphql } from 'graphql'
import { loadSchemaByConfig } from './utils/loadSchemaByConfig'

export interface EntityServerOptions<TQuery = any> {
  schema: GraphQLSchema
  Query: TQuery
}

export interface CreateEntityServerOptions<TQuery = any> {
  Query: TQuery
}

export class EntityServer<TQuery = any> {
  private schema: GraphQLSchema
  private root: TQuery

  constructor({ schema, Query }: EntityServerOptions) {
    this.schema = schema
    this.root = Query
  }

  async query(source: string) {
    return graphql(this.schema, source, this.root)
  }
}

export const createEntityServer = <TQuery = any>({
  Query,
}: CreateEntityServerOptions): EntityServer => {
  const schema = loadSchemaByConfig()

  return new EntityServer({ schema, Query })
}
