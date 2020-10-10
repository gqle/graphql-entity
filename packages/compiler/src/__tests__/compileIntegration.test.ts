import { getCompilationFiles } from './getCompilationFiles'

const _defaultSchema = /* GraphQL */ `
  type Query {
    _isExtended: boolean
  }
`

describe('compiler', () => {
  const subject = async (source: string) => {
    return getCompilationFiles([['/entity.ts', source]])
  }

  test('basic regression test', async () => {
    const entitySource = /* GraphQL */ `
      type User {
        name: String!
      }

      extend type Query {
        getUser: User!
      }
    `

    const { files } = await subject(entitySource)

    for (const file of files) {
      expect(file.filepath.path).toMatchSnapshot('file path')
      expect(file.write()).toMatchSnapshot('file contents')
    }
  })

  test('root extensions', async () => {
    const entitySource = /* GraphQL */ `
      extend type Query {
        getString: String!
      }

      extend type Mutation {
        setString: String!
      }

      extend type Subscription {
        onString: String!
      }
    `

    const { files } = await subject(entitySource)

    for (const file of files) {
      expect(file.filepath.path).toMatchSnapshot('file path')
      expect(file.write()).toMatchSnapshot('file contents')
    }
  })
})
