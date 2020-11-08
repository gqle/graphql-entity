import { ObjectTypeExtensionNode } from 'graphql/language'
import { Field, FieldOptions, Parameter } from './Field'
import { Type } from './Type'

export enum RootExtensionKind {
  Query,
  Mutation,
  Subscription,
}

export interface RootExtensionOptions extends FieldOptions {
  kind: RootExtensionKind
}

/**
 * RootExtension represents an extension of one of the root types: Query, Mutation, Subscription
 */
export class RootExtension extends Field {
  kind: RootExtensionKind

  constructor({ kind, name, parameters, type }: RootExtensionOptions) {
    super({ name, parameters, type })
    this.kind = kind
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
      let parameters: Parameter[] = []
      if (field.arguments) {
        parameters = field.arguments.map((argument) => {
          return [argument.name.value, Type.fromGraphQLType(argument.type)]
        })
      }

      return new RootExtension({
        kind,
        name: field.name.value,
        parameters,
        type: Type.fromGraphQLType(field.type),
      })
    })
  }
}
