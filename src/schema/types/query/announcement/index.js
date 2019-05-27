import { GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql'
import AnnouncementType from './anno-type'
import resolve from './anno-resolver'

export default {
  type: new GraphQLList(AnnouncementType),
  resolve,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
}
