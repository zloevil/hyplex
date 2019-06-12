import {
  GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString,
} from 'graphql'

const RoomsType = new GraphQLObjectType({
  name: 'RoomsByIdType',
  fields: {
    id: { type: GraphQLString },
    date: { type: GraphQLInt },
    center: {
      type: new GraphQLObjectType({
        name: 'CenterByIdType',
        fields: {
          x: { type: GraphQLInt },
          y: { type: GraphQLInt },
        },
      }),
      resolve(parentValue) {
        return parentValue.center
      },
    },
    tags: { type: new GraphQLList(GraphQLString) },
    walls: { type: new GraphQLList(GraphQLString) },
    equipment: { type: new GraphQLList(GraphQLString) },
    photos: { type: new GraphQLList(GraphQLString) },
  },
})

export default RoomsType
