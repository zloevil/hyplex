import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql'

const RoomsType = new GraphQLObjectType({
  name: 'RoomsType',
  fields: {
    id: { type: GraphQLString },
    date: { type: GraphQLInt },
    center: {
      type: new GraphQLObjectType({
        name: 'CenterType',
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
