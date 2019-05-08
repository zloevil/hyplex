import { GraphQLObjectType } from 'graphql'
import UserType from '../user'


const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: UserType,
  },
})

export default RootQuery
