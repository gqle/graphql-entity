import { GraphQLSchema, graphql } from 'graphql'
import { loadSchemaByConfig } from './utils/loadSchemaByConfig'

export interface EntityServerOptions<TRoot = any> {
  schema: GraphQLSchema
  root: TRoot
}

export interface CreateEntityServerOptions<TRoot = any> {
  root: TRoot
}

export class EntityServer<TRoot = any> {
  private schema: GraphQLSchema
  private root: TRoot

  constructor({ schema, root }: EntityServerOptions) {
    this.schema = schema
    this.root = root
  }

  async run(source: string) {
    return graphql(this.schema, source, this.root)
  }
}

export const createEntityServer = <TRoot = any>({
  root,
}: CreateEntityServerOptions): EntityServer => {
  const schema = loadSchemaByConfig()

  return new EntityServer<TRoot>({ schema, root })
}
