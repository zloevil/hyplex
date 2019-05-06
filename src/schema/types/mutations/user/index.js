import { GraphQLString, GraphQLNonNull } from 'graphql'
import UserType from './user-type'
import resolve from './user-resolver'

export default {
  type: UserType,
  resolve,
  args: {
    login: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
}
