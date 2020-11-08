import { AbsolutePath } from '../../lib/path'
import { getCompilationFiles } from './getCompilationFiles'

const ENTITY_FILE = '/entity.ts'

describe('enum types', () => {
  const subject = async (source: string) => {
    return getCompilationFiles([[ENTITY_FILE, source]])
  }

  test('compiles enum types', async () => {
    const entitySource = /* GraphQL */ `
      enum UserRole {
        ADMIN
        NO_ROLE
      }

      type User {
        name: String!
        role: UserRole!
      }
    `

    const writer = await subject(entitySource)

    const section = writer.file(AbsolutePath.from(ENTITY_FILE)).section('Definitions').write()
    expect(section).toMatchInlineSnapshot(`
      "
      /*
       * Definitions
       */

      export enum UserRole {
        Admin = ADMIN,
        NoRole = NO_ROLE,
      }

      export interface User {
        name: string;
        role: UserRole;
      }

      "
    `)
  })
})
