import { GraphQLSchema } from 'graphql'
import { applySchemaCustomDirectives } from 'graphql-custom-directive'
import RootQuery from './types/query/root-query'
import RootMutation from './types/mutations/root-mutation'
import directives from './directives'

const schema = new GraphQLSchema({
  directives,
  query: RootQuery,
  mutation: RootMutation,
})

applySchemaCustomDirectives(schema)

export default schema
