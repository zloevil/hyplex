import { GraphQLList } from 'graphql'
import RoomsType from './rooms-type'
import resolve from './rooms-resolver'

export default {
  type: new GraphQLList(RoomsType),
  resolve,
}
