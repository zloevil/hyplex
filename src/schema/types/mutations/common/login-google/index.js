import { GraphQLString, GraphQLNonNull } from 'graphql'
import LoginGoogleType from './login-google-type'
import resolve from './login-google-resolver'

export default {
  type: LoginGoogleType,
  resolve,
  args: {
    accessToken: { type: new GraphQLNonNull(GraphQLString) },
  },
}
