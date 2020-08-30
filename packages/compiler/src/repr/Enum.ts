import { EnumTypeDefinitionNode } from 'graphql/language'

export interface EnumOptions {
  name: string
  members: string[]
}

export class Enum {
  name: string
  members: string[]

  constructor({ name, members }: EnumOptions) {
    this.name = name
    this.members = members
  }

  static fromEnum(def: EnumTypeDefinitionNode): Enum {
    const name = def.name.value
    const members = (def.values ?? []).map((value) => value.name.value)

    return new Enum({ name, members })
  }
}
