import { GraphQLObjectType } from 'graphql'
import NewUserType from '../user'
import LoginType from '../common/login'
import LogoutType from '../common/logout'
import LoginGoogleType from '../common/login-google'
import AnnouncementType from '../announcement'


const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    registration: NewUserType,
    login: LoginType,
    logout: LogoutType,
    loginGoogle: LoginGoogleType,
    announcement: AnnouncementType,
  },
})

export default RootMutation
