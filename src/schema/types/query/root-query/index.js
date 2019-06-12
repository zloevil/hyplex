import { GraphQLObjectType } from 'graphql'
import UserType from '../user'
import AnnouncementsType from '../announcement'
import AnnouncementsByIdType from '../announcement-by-id'


const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    user: UserType,
    announcements: AnnouncementsType,
    announcementById: AnnouncementsByIdType,
  },
  directives: {
    hasScope: {
      scope: ['read'],
    },
  },
})

export default RootQuery
