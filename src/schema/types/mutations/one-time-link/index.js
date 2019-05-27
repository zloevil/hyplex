import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql'
import OneTimeLinkType from './one-time-link-type'
import resolve from './one-time-link-resolver'

export default {
  type: OneTimeLinkType,
  resolve,
  args: {
    type: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    isZipped: { type: GraphQLString },
    directory: { type: GraphQLString },
    id: { type: GraphQLString },
    lifeTime: { type: GraphQLInt },
  },
}
