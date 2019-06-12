import {
  DirectiveLocation,
} from 'graphql/language/directiveLocation'

import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql'

import {
  GraphQLCustomDirective,
} from 'graphql-custom-directive'

import resolve from './resolver'

export default new GraphQLCustomDirective({
  name: 'hasScope',
  description:
    'check users scope',
  locations: [
    DirectiveLocation.FIELD,
    DirectiveLocation.QUERY,
  ],
  args: {
    scope: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
    },
  },
  resolve,
})
