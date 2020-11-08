import { Type } from './Type'

export type Parameter = [name: string, type: Type]

export interface FieldOptions {
  name: string
  parameters: Parameter[]
  type: Type
}

export class Field {
  name: string
  parameters: Parameter[]
  type: Type

  constructor({ name, parameters, type }: FieldOptions) {
    this.name = name
    this.parameters = parameters
    this.type = type
  }
}
