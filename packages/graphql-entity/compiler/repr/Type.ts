import { TypeNode as GraphQLTypeNode } from 'graphql/language'
import { TypeNode, getTypeNode, printType, getTypeName } from './TypeNode'

export class Type {
  node: TypeNode

  constructor(node: TypeNode) {
    this.node = node
  }

  static fromGraphQLType(type: GraphQLTypeNode): Type {
    return new Type(getTypeNode(type))
  }

  print(): string {
    return printType(this.node)
  }

  getName(): string {
    return getTypeName(this.node)
  }
}
