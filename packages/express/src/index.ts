import type { EntityServer } from 'graphql-entity'
import type { RequestHandler } from 'express'

export type GraphQLEntityHandler = (
  server: EntityServer
) => RequestHandler<{}, any, { query: string; variables?: Record<string, unknown> }>

export const graphqlEntity: GraphQLEntityHandler = (server) => async (req, res, next) => {
  try {
    const { query, variables } = req.body
    const response = await server.run({ query, variables })
    res.json(response)
  } catch (err) {
    next(err)
  }
}
