import {
  AnswerStatus,
  AssessmentStatus,
  UserSimulationStatus,
} from 'src/utils/status'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'

import IRole from 'src/models/role/role.interface'
import IUser from 'src/models/user/user.interface'
import Select from 'src/ui/core/components/mui/inputs/Select/Select'
import { Utils } from '@utils'
import compose from '@shopify/react-compose'
import { useRootStore } from 'src/stores'
import { withFind } from '@hocs'

const ScorerSelectView = ({
  row,
  users,
  roles,
  path,
  mutate,
}: {
  row: any
  users: IUser[]
  roles: IRole[]
  path: string
  mutate: any
}) => {
  const { assessmentStore, answerStore } = useRootStore()

  const localState = useLocalObservable(() => ({
    assessment: row.original,
  }))
  const values = path.split('.')
  reaction(
    () => {
      return localState.assessment[values[0]][values[1]]
    },
    async (value) => {
      try {
        await assessmentStore.repository.update({
          filter: { _id: localState.assessment._id },
          update: { [path]: value },
        })
        await answerStore.repository.update({
          filter: {
            assessmentId: localState.assessment._id,
          },
          update: {
            $set: {
              [`scoring.${values[0]}.scorerId`]: value,
              [`scoring.${values[0]}.noteId`]: null,
              [`scoring.${values[0]}.answerStatus`]: AnswerStatus.NotScored,
              [`scoring.${values[0]}.updatedAt`]: new Date(),
            },
          },
        })
        mutate && mutate()
      } catch (error) {
        Utils.errorLog(error)
      }
    }
  )

  const isPublished =
    row.original?.userSimulation.status === UserSimulationStatus.Published

  const isDistributed =
    row.original?.userSimulation.status === UserSimulationStatus.Distributed
  // localState.assessment.status === AssessmentStatus.Published
  const userOptions = users?.map((user) => {
    const role = roles.find((role) => role._id === user.roleId)

    return {
      // text: user.name + '-' + role?.title,
      text:
        role?.title === 'SuperAdmin'
          ? 'superAdmin'
          : `${user.profile?.firstName} ${user.profile?.lastName}`,
      value: user._id,
    }
  })
  return (
    <Select
      className="table-select"
      disabled={isPublished || isDistributed}
      options={userOptions}
      state={localState.assessment}
      path={path}
      sx={{
        width: '180px',
        height: '20px',
        '&.MuiOutlinedInput-root': {
          height: '20px !important',
          padding: 0,
        },
      }}
    />
  )
}

const getRolesFilter = () => ({})

const getUsersFilter = (props: { roles: IRole[] }) => {
  const scorerRoles = ['SimScorer', 'ClientAdmin', 'Admin', 'SuperAdmin']
  return {
    roleId: {
      $in: props.roles
        .filter((role) => scorerRoles.includes(role.title))
        .map((role) => role._id),
    },
  }
}

export default compose<any>(
  withFind({
    collectionName: 'roles',
    getFilter: getRolesFilter,
  }),
  withFind({
    collectionName: 'users',
    getFilter: getUsersFilter,
  })
)(observer(ScorerSelectView))
