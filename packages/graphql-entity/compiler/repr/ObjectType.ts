import { Field } from './Field'
import { Type } from './Type'

export interface ObjectTypeOptions {
  name: string
  fields: Field[]
}

export class ObjectType {
  name: string
  importAs: string
  fields: Field[]

  constructor({ name, fields }: ObjectTypeOptions) {
    this.name = name
    this.fields = fields
    this.importAs = name
  }
}
