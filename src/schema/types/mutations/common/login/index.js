import { GraphQLString, GraphQLNonNull } from 'graphql'
import LoginType from './login-type'
import resolve from './login-resolver'

export default {
  type: LoginType,
  resolve,
  args: {
    login: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
}
