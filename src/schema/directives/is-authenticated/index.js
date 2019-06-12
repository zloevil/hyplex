import {
  DirectiveLocation,
} from 'graphql/language/directiveLocation'

import {
  GraphQLCustomDirective,
} from 'graphql-custom-directive'

import resolve from './resolver'

export default new GraphQLCustomDirective({
  name: 'isAuthenticated',
  description:
    'check user token',
  locations: [
    DirectiveLocation.FIELD,
    DirectiveLocation.QUERY,
  ],
  resolve,
})
