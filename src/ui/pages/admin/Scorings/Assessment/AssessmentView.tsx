import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
} from '@mui/material'
import { useEffect, useState } from 'react'

import Assessment from 'src/models/assessment'
import AssessmentTopBar from './AssessmentTopBar/AssessmentTopBar'
import Findings from './Findings/Findings'
import MNotes from './MNotes/MNotes'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

function AssessmentView(props: {
  userSimulation: UserSimulation
  assessment: Assessment
}) {
  const {
    authStore: { user },
    uiState: { assessment: assessmentUi },
  } = useRootStore()
  const [loading, setLoading] = useState<boolean>(true)
  const { userSimulation, assessment } = props

  useEffect(() => {
    assessmentUi.setScorerType(assessment, user._id)
    setLoading(false)
  }, [])

  if (!userSimulation || loading) return null

  return (
    <Paper
      sx={{ p: 2, mt: 2, height: 'calc(100vh - 85px)' }}
      className="paper-grid"
    >
      <Grid
        container
        item
        xs={12}
        spacing={2}
        sx={{ height: 'calc(100% - 30px)' }}
      >
        <Grid item xs={12}>
          <AssessmentTopBar userSimulation={userSimulation} />
        </Grid>
        <Grid item xs={6} sx={{ height: '100%' }}>
          <Card
            className="paper-grid"
            sx={{ height: '100%', p: 0, overflow: 'auto' }}
          >
            <CardHeader title="MN Notes" sx={{ p: 2 }} />
            <CardContent sx={{ pt: 0, pl: 0, pr: 0 }}>
              <MNotes userSimulation={userSimulation} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sx={{ height: '100%' }}>
          <Card
            className="paper-grid"
            sx={{ height: '100%', p: 0, overflow: 'auto' }}
          >
            <CardHeader title="Findings" sx={{ p: 2 }} />
            <CardContent sx={{ pt: 0, pl: 0, pr: 0 }}>
              <Findings userSimulation={userSimulation} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default observer(AssessmentView)
