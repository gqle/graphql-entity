import { TypeNode as GraphQLTypeNode } from 'graphql/language'

export enum ListType {
  NullableList,
  NonNullableList,
}

export type TypeNode =
  | { kind: 'Type'; isNullable: boolean; name: string }
  | { kind: 'List'; isNullable: boolean; type: TypeNode }

const scalarToType: { [key: string]: string } = {
  Boolean: 'boolean',
  Float: 'number',
  ID: 'string',
  Int: 'number',
  String: 'string',
}

export const getTypeName = (type: TypeNode): string => {
  if (type.kind === 'List') {
    return getTypeName(type.type)
  }

  return type.name
}

export const getTypeNode = (type: GraphQLTypeNode): TypeNode => {
  let isNullable = true

  if (type.kind === 'NonNullType') {
    isNullable = false
    type = type.type
  }

  if (type.kind === 'ListType') {
    return { kind: 'List', isNullable, type: getTypeNode(type.type) }
  }

  return { kind: 'Type', isNullable, name: type.name.value }
}

export const printType = (type: TypeNode): string => {
  if (type.kind === 'List') {
    if (type.isNullable) {
      return `Maybe<${printType(type.type)}[]>`
    }

    return `${printType(type.type)}[]`
  }

  let tsType: string = scalarToType[type.name]

  if (!tsType) {
    tsType = type.name
  }

  if (type.isNullable) {
    return `Maybe<${tsType}>`
  }

  return tsType
}
