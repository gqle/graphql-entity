import { ObjectTypeDefinitionNode } from 'graphql'
import { Field, Parameter } from './Field'
import { ObjectType, ObjectTypeOptions } from './ObjectType'
import { Type } from './Type'

export class Entity extends ObjectType {
  constructor({ name, fields }: ObjectTypeOptions) {
    super({ name, fields })

    if (['Query', 'Mutation', 'Subscription'].includes(this.name)) {
      this.importAs = `_${name}`
    } else {
      this.importAs = name
    }
  }

  static fromObjectType(def: ObjectTypeDefinitionNode): Entity {
    const fields = (def.fields ?? []).map((field) => {
      let parameters: Parameter[] = []
      if (field.arguments) {
        parameters = field.arguments.map((argument) => {
          return [argument.name.value, Type.fromGraphQLType(argument.type)]
        })
      }

      return new Field({
        name: field.name.value,
        parameters,
        type: Type.fromGraphQLType(field.type),
      })
    })

    return new Entity({ name: def.name.value, fields })
  }
}
