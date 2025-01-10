import { Autocomplete, Grid, Stack, TextField } from 'src/ui/core/components'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  InputLabel,
} from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import _ from 'lodash'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'

export enum AssessmentCycleType {
  Normal = 'NORMAL',
  Prehire = 'PREHIRE',
}

function AssessmentCycleView({ assessmentTypes }: any) {
  const {
    assessmentCycleStore,
    uiState: { assessmentCycles },
  } = useRootStore()

  const state = useLocalObservable(() => ({
    buttons: [
      {
        text: AssessmentCycleType.Normal,
        value: AssessmentCycleType.Normal,
        isActive: false,
        onClick: () => {
          assessmentCycleStore.form.type = AssessmentCycleType.Normal
        },
      },
      {
        text: AssessmentCycleType.Prehire,
        value: AssessmentCycleType.Prehire,
        isActive: false,
        onClick: () => {
          assessmentCycleStore.form.type = AssessmentCycleType.Prehire
        },
      },
    ],
  }))

  useEffect(() => {
    state.buttons.forEach((button) => {
      if (button.value === assessmentCycleStore.form.type) {
        button.isActive = true
      } else {
        button.isActive = false
      }
    })
  }, [assessmentCycleStore.form.type])

  const assessmentTypeOptions = assessmentTypes.map((assessmentType: any) => {
    return {
      text: assessmentType.label,
      value: assessmentType._id,
    }
  })
  return (
    <DetailLayout store={assessmentCycleStore} mutate={assessmentCycles.mutate}>
      <Box sx={{ bgcolor: 'rgb(242, 243, 243)' }}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} md={6} lg={6}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              <CardHeader title="Common Information" />
              <CardContent>
                <Stack spacing={1}>
                  <InputLabel>A-Cycle Name</InputLabel>
                  <TextField
                    state={assessmentCycleStore}
                    path="form.name"
                    // label="A-Cycle Name"
                    variant="outlined"
                  />
                  <InputLabel>Type</InputLabel>
                  <Autocomplete
                    className="dd"
                    options={assessmentTypeOptions}
                    state={assessmentCycleStore}
                    path="form.assessmentTypeIds"
                    // label="Type"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              <CardHeader title="Tutorial" />
              <CardContent>
                <Stack spacing={1}>
                  <InputLabel>Simulation Tutorial</InputLabel>
                  <TextField
                    variant="outlined"
                    state={assessmentCycleStore}
                    path="form.tutorials.baselineUrl"
                    label="Baseline Video Link"
                    placeholder="https://vimeo.com/*********"
                  />
                  <InputLabel>Training Tutorial</InputLabel>
                  <TextField
                    variant="outlined"
                    state={assessmentCycleStore}
                    path="form.tutorials.trainingUrl"
                    label="Training Video Link"
                    placeholder="https://vimeo.com/*********"
                  />

                  {/* <TextField
                    state={assessmentCycleStore}
                    path="form.tutorials.followupUrl"
                    label="Followup Video Link"
                    placeholder="https://www.******.com/watch?v=********"
                  /> */}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              <CardHeader title="Type" />
              <CardContent>
                <ButtonGroup>
                  {state.buttons.map((button) => {
                    let variant = 'outlined' as 'outlined' | 'contained'
                    if (button.isActive) {
                      variant = 'contained'
                    }
                    // @ts-ignore
                    return (
                      <Button variant={variant} onClick={button.onClick}>
                        {button.text}
                      </Button>
                    )
                  })}
                </ButtonGroup>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DetailLayout>
  )
}
export default observer(AssessmentCycleView)
