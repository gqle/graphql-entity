import { AbsolutePath } from '@gqle/shared'
import { Entity, Enum, RootExtension } from './repr'

export interface EntityDocument {
  entities: Entity[]
  enums: Enum[]
  rootExtensions: RootExtension[]
  location: AbsolutePath
}
