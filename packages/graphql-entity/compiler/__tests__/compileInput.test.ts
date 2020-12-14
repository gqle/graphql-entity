import { AbsolutePath } from '../../lib/path'
import { getCompilationFiles } from './getCompilationFiles'

const ENTITY_FILE = '/entity.ts'

describe('input types', () => {
  const subject = async (source: string) => {
    return getCompilationFiles([[ENTITY_FILE, source]])
  }

  test('compiles input types to interfaces', async () => {
    const entitySource = /* GraphQL */ `
      input User {
        name: String!
        age: Int!
      }
    `

    const writer = await subject(entitySource)

    const section = writer.file(AbsolutePath.from(ENTITY_FILE)).section('Definitions').write()
    expect(section).toMatchInlineSnapshot(`
      "
      /*
       * Definitions
       */

      // Input
      export interface User {
        name: string;
        age: number;
      }
      "
    `)
  })

  test('references input types as arguments to queries', async () => {
    const entitySource = /* GraphQL */ `
      extend type Query {
        needsNothing: Boolean!
        needsUser(name: String!, age: Int!): Boolean!
      }
    `

    const writer = await subject(entitySource)

    const section = writer.file(AbsolutePath.from(ENTITY_FILE)).section('RootExtensions').write()
    expect(section).toMatchInlineSnapshot(`
      "
      /*
       * RootExtensions
       */

      export interface NeedsUserParameters {
        name: string;
        age: number;
      }

      export interface RootExtensions {
        needsNothing: Resolvable<boolean>;
        needsUser: Resolvable<boolean, NeedsUserParameters>;
      }
      "
    `)
  })

  test('references input types in object definitions', async () => {
    const entitySource = /* GraphQL */ `
      input User {
        name: String!
        age: Int!
      }

      type ParentType {
        requiresUser(user: User!): Boolean!
      }
    `

    const writer = await subject(entitySource)

    const section = writer.file(AbsolutePath.from(ENTITY_FILE)).section('Definitions').write()
    expect(section).toMatchInlineSnapshot(`
      "
      /*
       * Definitions
       */

      // Input
      export interface User {
        name: string;
        age: number;
      }

      export interface RequiresUserParameters {
        user: User;
      }

      export interface ParentType {
        requiresUser: Resolvable<boolean, RequiresUserParameters>;
      }
      "
    `)
  })

  test('references input types correctly from root', async () => {
    const entitySource = /* GraphQL */ `
      input User {
        name: String!
        age: Int!
      }

      extend type Query {
        needsNothing: Boolean!
        needsUser(user: User!): Boolean!
      }
    `

    const writer = await subject(entitySource)

    const file = writer.file(AbsolutePath.from('/'))
    expect(file.writeImports()).toMatchInlineSnapshot(`
      "import { Awaitable, Maybe, Resolvable } from \\"graphql-entity/prelude\\";
      import { createEntityServer as baseCreateEntityServer } from \\"graphql-entity\\";
      import { NeedsUserParameters } from \\"./entity\\";
      "
    `)
    expect(file.section('Root').write()).toMatchInlineSnapshot(`
      "
      /*
       * Root
       */

      export interface Root {
        needsNothing: Resolvable<boolean>;
        needsUser: Resolvable<boolean, NeedsUserParameters>;
      }
      "
    `)
  })
})
