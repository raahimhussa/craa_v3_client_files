import IUser from 'src/models/user/user.interface'
import PaginationTable from 'src/ui/components/PaginationTable'
import { Role } from 'src/models/role'
import Users from 'src/ui/core/components/tables/Users/Users'
import { observer } from 'mobx-react'
import User from 'src/models/user'
import { Authority } from 'src/models/user/types'

type Props = {
  role: Role
  user: User
  authorization: Authority
}

function UsersView({ role, user, authorization }: Props) {
  return (
    <PaginationTable
      collectionName="users"
      version={1}
      Table={Users}
      params={{
        filter: {
          isDeleted: false,
          roleId: { $ne: role._id },
          'profile.clientUnitId': {
            $in: authorization?.whitelist.map((_wl) => _wl.clientId),
          },
          // clientUnitId: '643d8a5b9a8995fdcd7e6a03',
          'profile.businessUnitId': {
            $in: authorization?.whitelist.reduce((acc, cur) => {
              return [...acc, ...cur.businessUnits]
            }, [] as string[]),
          },
        },
        options: { multi: true },
      }}
    />
  )
}
export default observer(UsersView)
