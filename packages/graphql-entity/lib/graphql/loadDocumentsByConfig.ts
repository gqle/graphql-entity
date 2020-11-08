import { resolveConfig } from '../config/resolveConfig'
import { loadDocumentsFromGraphQLFiles } from './loadDocuments'

export const loadDocumentsByConfig = (): ReturnType<typeof loadDocumentsFromGraphQLFiles> => {
  const { documents } = resolveConfig()

  return loadDocumentsFromGraphQLFiles(documents)
}
