import { ObjectTypeDefinitionNode } from 'graphql/language'
import { Type } from './Type'

export interface EntityField {
  name: string
  type: Type
}

export interface EntityOptions {
  name: string
  fields: EntityField[]
}

export class Entity {
  name: string
  importAs: string
  fields: EntityField[]

  constructor({ name, fields }: EntityOptions) {
    this.name = name
    this.fields = fields

    if (['Query', 'Mutation', 'Subscription'].includes(this.name)) {
      this.importAs = `_${name}`
    } else {
      this.importAs = name
    }
  }

  static fromObjectType(def: ObjectTypeDefinitionNode): Entity {
    const fields = (def.fields ?? []).map((field) => {
      return {
        name: field.name.value,
        type: Type.fromGraphQLType(field.type),
      }
    })

    return new Entity({ name: def.name.value, fields })
  }
}
