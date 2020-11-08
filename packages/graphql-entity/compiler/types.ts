import { AbsolutePath } from '../lib/path'
import { Entity, Enum, RootExtension } from './repr'
import { Input } from './repr/Input'

export interface EntityDocument {
  entities: Entity[]
  enums: Enum[]
  inputs: Input[]
  location: AbsolutePath
  rootExtensions: RootExtension[]
}
