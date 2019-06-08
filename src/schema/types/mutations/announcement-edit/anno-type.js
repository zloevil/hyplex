import { GraphQLObjectType, GraphQLString } from 'graphql'

const AnnoType = new GraphQLObjectType({
  name: 'AnnouncementEdit',
  fields: {
    id: {
      type: GraphQLString,
    },
  },
})

export default AnnoType
