import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql'

const RoomsType = new GraphQLObjectType({
  name: 'RoomsType',
  fields: {
    tags: { type: new GraphQLList(GraphQLString) },
    walls: { type: new GraphQLList(GraphQLString) },
    equipment: { type: new GraphQLList(GraphQLString) },
  },
})

export default RoomsType
