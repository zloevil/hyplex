import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import UserType from './types/user'


const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: UserType,
  },
})

export default new GraphQLSchema({
  query: RootQuery,
})
