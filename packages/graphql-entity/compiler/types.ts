import { AbsolutePath } from '../lib/path'
import { Entity, Enum, RootExtension } from './repr'

export interface EntityDocument {
  entities: Entity[]
  enums: Enum[]
  rootExtensions: RootExtension[]
  location: AbsolutePath
}
