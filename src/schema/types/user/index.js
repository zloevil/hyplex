import { GraphQLString } from 'graphql'
import UserType from './user-type'
import resolve from './user-resolver'

export default {
  type: UserType,
  resolve,
  args: { login: { type: GraphQLString } },
}
