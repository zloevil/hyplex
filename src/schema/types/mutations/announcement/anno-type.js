import { GraphQLObjectType, GraphQLString } from 'graphql'

const AnnoType = new GraphQLObjectType({
  name: 'AnnouncementResp',
  fields: {
    id: {
      type: GraphQLString,
    },
  },
})

export default AnnoType
