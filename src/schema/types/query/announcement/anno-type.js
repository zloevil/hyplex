import { GraphQLObjectType, GraphQLString } from 'graphql'
import RoomsType from './RoomsType'

const AnnoType = new GraphQLObjectType({
  name: 'AnnouncementReq',
  fields: {
    shapes: { type: GraphQLString },
    rooms: RoomsType,
    id: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  },
})

export default AnnoType
