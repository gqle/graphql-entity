import { loadTypedefsSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { AbsolutePath } from '../../lib/path'

export const loadDocumentsFromGraphQLFiles = (
  path: AbsolutePath | AbsolutePath[]
): ReturnType<typeof loadTypedefsSync> => {
  const pathsToLoad = path instanceof AbsolutePath ? path.path : path.map((path) => path.path)

  return loadTypedefsSync(pathsToLoad, {
    loaders: [new GraphQLFileLoader()],
  })
}
