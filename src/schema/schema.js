import { GraphQLSchema } from 'graphql'
import RootQuery from './types/query/root-query'
import RootMutation from './types/mutations/root-mutation'

export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
})
