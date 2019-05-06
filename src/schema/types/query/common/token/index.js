import { GraphQLString, GraphQLNonNull } from 'graphql'
import TokenType from './token-type'
import resolve from './token-resolver'

export default {
  type: TokenType,
  resolve,
  args: {
    login: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
}
