import { InputObjectTypeDefinitionNode } from 'graphql'
import { Field } from './Field'
import { ObjectType } from './ObjectType'
import { Type } from './Type'

export class Input extends ObjectType {
  static fromInputObjectType(def: InputObjectTypeDefinitionNode): Input {
    const fields = (def.fields ?? []).map((field) => {
      return new Field({
        name: field.name.value,
        // Input types never have parameters
        parameters: [],
        type: Type.fromGraphQLType(field.type),
      })
    })

    return new Input({ name: def.name.value, fields })
  }
}
