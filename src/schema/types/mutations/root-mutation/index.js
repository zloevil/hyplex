import { GraphQLObjectType } from 'graphql'
import NewUserType from '../user'


const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    registration: NewUserType,
  },
})

export default RootMutation
