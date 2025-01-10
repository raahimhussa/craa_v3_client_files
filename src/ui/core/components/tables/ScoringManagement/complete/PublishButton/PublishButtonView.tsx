import { Box, Button } from '@mui/material'
import { ScorerStatus, UserSimulationStatus } from 'src/utils/status'

import Assessment from 'src/models/assessment'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

function PublishButtonView({
  assessment,
  userSimulation,
  mutate,
}: {
  assessment: Assessment
  userSimulation: UserSimulation
  mutate: any
}) {
  const { enqueueSnackbar } = useSnackbar()

  const isScoringCompleted =
    assessment.firstScorer.status === ScorerStatus.Complete ||
    assessment.secondScorer.status === ScorerStatus.Complete

  const isAdjudicationCompleted =
    assessment.adjudicator.status === ScorerStatus.Complete

  const onClickPublish = async () => {
    try {
      if (userSimulation) {
        await axios.patch(
          `/v3/scoringManagement/userSimulations/${userSimulation._id}/publish`
        )
      }
      mutate && mutate()
      enqueueSnackbar('Published', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed', { variant: 'error' })
    }
  }

  const isPublished = userSimulation.status === UserSimulationStatus.Published
  const isDistributed =
    userSimulation.status === UserSimulationStatus.Distributed
  return (
    <Button
      disabled={
        !isScoringCompleted ||
        !isAdjudicationCompleted ||
        isPublished ||
        isDistributed ||
        !userSimulation.results
      }
      onClick={onClickPublish}
      variant="contained"
    >
      {isPublished || isDistributed ? 'Published' : 'Publish'}
    </Button>
  )
}

export default observer(PublishButtonView)
