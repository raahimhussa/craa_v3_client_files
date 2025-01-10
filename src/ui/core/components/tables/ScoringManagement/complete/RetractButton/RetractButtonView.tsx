import { AssessmentStatus, UserSimulationStatus } from 'src/utils/status'
import { Box, Button } from '@mui/material'

import Assessment from 'src/models/assessment'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

function RetractButtonView({
  userSimulation,
  mutate,
}: {
  userSimulation: UserSimulation
  mutate: any
}) {
  const { enqueueSnackbar } = useSnackbar()

  const onClickRetract = async () => {
    try {
      await axios.post(
        `v3/scoringManagement/userSimulations/${userSimulation._id}/retract`
      )
      mutate && mutate()
      enqueueSnackbar('Retracted', { variant: 'success' })
    } catch (e) {
      enqueueSnackbar('Error', { variant: 'error' })
      throw e
    }
  }
  const isPublished = userSimulation.status === UserSimulationStatus.Published
  const isDistributed =
    userSimulation.status === UserSimulationStatus.Distributed
  return (
    <Button
      disabled={!(isPublished || isDistributed)}
      onClick={onClickRetract}
      variant="contained"
    >
      Retract
    </Button>
  )
}

export default observer(RetractButtonView)
