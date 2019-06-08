import { GraphQLString, GraphQLNonNull } from 'graphql'
import { GraphQLJSON } from 'graphql-type-json'
import AnnoType from './anno-type'
import resolve from './anno-resolver'

export default {
  type: AnnoType,
  resolve,
  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    shapes: { type: new GraphQLNonNull(GraphQLString) },
    rooms: { type: new GraphQLNonNull(GraphQLJSON) },
  },
}
