import { getCompilationFiles } from './getCompilationFiles'

const _defaultSchema = /* GraphQL */ `
  type Query {
    _isExtended: boolean
  }
`

describe('compiler', () => {
  test('basic regression test', async () => {
    const subject = async (source: string) => {
      return getCompilationFiles([['/entity.ts', source]])
    }

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
    const subject = async (source: string) => {
      return getCompilationFiles([['/entity.ts', source]])
    }

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

  // Import of `/entity.ts` from `/` should be `./entity`
  test('relative entity imports', async () => {
    const subject = async (source: string) => {
      return getCompilationFiles([['/entity.ts', source]])
    }

    const entitySource = /* GraphQL */ `
      type User {
        name: String!
      }
    `

    const { files } = await subject(entitySource)

    const rootFile = files.find((f) => f.filepath.path === '/')
    expect(rootFile?.writeImports()).toMatchInlineSnapshot(`
      "import { Awaitable, Maybe, Resolvable } from \\"graphql-entity/prelude\\";
      import { createEntityServer as baseCreateEntityServer } from \\"graphql-entity\\";
      import { User as User } from \\"./entity\\";
      "
    `)
    const entityFile = files.find((f) => f.filepath.path === '/entity.ts')
    expect(entityFile?.writeImports()).toMatchInlineSnapshot(`
      "import { Awaitable, Maybe, Resolvable } from \\"graphql-entity/prelude\\";
      "
    `)
  })
})
