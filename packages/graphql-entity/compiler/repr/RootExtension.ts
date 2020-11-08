import { Kind, ObjectTypeExtensionNode } from 'graphql/language'
import { Type } from './Type'

export enum RootExtensionKind {
  Query,
  Mutation,
  Subscription,
}

export interface RootExtensionOptions {
  kind: RootExtensionKind
  name: string
  type: Type
}

/**
 * RootExtension represents an extension of one of the root types: Query, Mutation, Subscription
 */
export class RootExtension {
  kind: RootExtensionKind
  name: string
  type: Type

  constructor({ kind, name, type }: RootExtension) {
    this.kind = kind
    this.name = name
    this.type = type
  }

  static fromObjectTypeExtension(def: ObjectTypeExtensionNode): RootExtension[] {
    let kind: RootExtensionKind

    if (def.name.value === 'Query') {
      kind = RootExtensionKind.Query
    } else if (def.name.value === 'Mutation') {
      kind = RootExtensionKind.Mutation
    } else if (def.name.value === 'Subscription') {
      kind = RootExtensionKind.Subscription
    } else {
      return []
    }

    return (def.fields ?? []).map((field) => {
      return new RootExtension({
        kind,
        name: field.name.value,
        type: Type.fromGraphQLType(field.type),
      })
    })
  }
}
