import { GraphQLObjectType, GraphQLString } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import RoomsType from './RoomsType'

const AnnoType = new GraphQLObjectType({
  name: 'AnnouncementReq',
  fields: {
    shapes: { type: GraphQLString },
    rooms: RoomsType,
    // rooms: {
    //   type: new GraphQLObjectType({
    //     name: 'RoomsType',
    //     fields: {
    //       tags: { type: GraphQLJSON },
    //       wells: { type: GraphQLJSON },
    //       equipment: { type: GraphQLJSON },
    //     },
    //   }),
    //   resolve(parentValue) {
    //     console.log(parentValue)
    //     return parentValue.rooms
    //   },
    // },
    id: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  },
})

export default AnnoType
