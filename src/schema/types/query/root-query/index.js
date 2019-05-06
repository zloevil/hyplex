import { GraphQLObjectType } from 'graphql'
import UserType from '../user'
import TokenType from '../common/token'


const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: UserType,
    login: TokenType,
  },
})

export default RootQuery
