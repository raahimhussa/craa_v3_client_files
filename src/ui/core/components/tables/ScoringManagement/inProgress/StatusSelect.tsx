import { AssessmentStatus, UserSimulationStatus } from 'src/utils/status'
import { observer, useLocalObservable } from 'mobx-react'

import Assessment from 'src/models/assessment'
import { CellProps } from 'react-table'
import Select from 'src/ui/core/components/mui/inputs/Select/Select'
import UserSimulation from 'src/models/userSimulation'
import { reaction } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

const StatusSelectView = (
  props: CellProps<Assessment & { userSimulation: UserSimulation }> & {
    type: 'firstScorer' | 'secondScorer' | 'adjudicator'
    mutate: any
  }
) => {
  const { assessmentStore } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()
  const isPublished =
    props.row.original?.userSimulation.status === UserSimulationStatus.Published
  const isDistributed =
    props.row.original?.userSimulation.status ===
    UserSimulationStatus.Distributed
  let scorer: any = props.row.original.firstScorer
  if (props.type === 'firstScorer') {
    scorer = props.row.original.firstScorer
  } else if (props.type === 'secondScorer') {
    scorer = props.row.original.secondScorer
  } else if (props.type === 'adjudicator') {
    scorer = props.row.original.adjudicator
  }

  const statusOptions = [
    {
      text: 'InProgress',
      value: AssessmentStatus.InProgress,
    },
    {
      text: 'Pending',
      value: AssessmentStatus.Pending,
    },
    {
      text: 'Complete',
      value: AssessmentStatus.Complete,
    },
  ]

  const state = useLocalObservable(() => ({
    scorer: scorer,
  }))
  //FIXME - isPublished must be with userSimulation

  reaction(
    () => state.scorer.status,
    (newStatus) => {
      try {
        assessmentStore.changeStatus(
          props.row.original._id,
          props.type,
          newStatus
        )
        props.mutate && props.mutate()
      } catch (error) {
        return console.log(error)
      }

      enqueueSnackbar('Status Changed', { variant: 'success' })
    }
  )

  return (
    <Select
      disabled={isPublished || isDistributed}
      sx={{ width: '165px', height: '30px' }}
      options={statusOptions}
      state={state}
      path="scorer.status"
    />
  )
}

export default observer(StatusSelectView)
