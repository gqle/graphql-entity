import { ObjectTypeExtensionNode } from 'graphql/language'
import { Type } from './Type'

export interface QueryOptions {
  name: string
  type: Type
}

export class Query {
  name: string
  type: Type

  constructor({ name, type }: QueryOptions) {
    this.name = name
    this.type = type
  }

  static fromQueryExtension(def: ObjectTypeExtensionNode): Query[] {
    return (def.fields ?? []).map((field) => {
      return new Query({
        name: field.name.value,
        type: Type.fromGraphQLType(field.type),
      })
    })
  }
}
