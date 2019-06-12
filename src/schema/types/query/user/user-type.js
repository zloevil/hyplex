import { GraphQLObjectType, GraphQLString } from 'graphql'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    user_id: {
      type: GraphQLString,
    },
    login: {
      type: GraphQLString,
    },
  },
})

export default UserType
