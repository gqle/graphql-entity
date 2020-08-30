import { AbsolutePath } from '@gqle/shared'
import { Entity, Enum } from './repr'

export interface EntityDocument {
  entities: Entity[]
  enums: Enum[]
  location: AbsolutePath
}
