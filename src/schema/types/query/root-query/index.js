import { GraphQLObjectType } from 'graphql'
import UserType from '../user'
import AnnouncementsType from '../announcement'


const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: UserType,
    announcements: AnnouncementsType,
  },
  directives: {
    hasScope: {
      scope: ['read'],
    },
  },
})

export default RootQuery
