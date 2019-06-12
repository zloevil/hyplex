import { GraphQLObjectType } from 'graphql'
import NewUserType from '../user'
import LoginType from '../common/login'
import LogoutType from '../common/logout'
import LoginGoogleType from '../common/login-google'
import AnnouncementType from '../announcement'
import OneTimeLinkType from '../one-time-link'
import AnnouncementEditType from '../announcement-edit'


const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    registration: NewUserType,
    login: LoginType,
    logout: LogoutType,
    loginGoogle: LoginGoogleType,
    announcement: AnnouncementType,
    oneTimeLink: OneTimeLinkType,
    announcementEdit: AnnouncementEditType,
  },
  directives: {
    hasScope: {
      scope: ['write'],
    },
  },
})

export default RootMutation
