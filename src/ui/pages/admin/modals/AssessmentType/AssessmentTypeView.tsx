import { Autocomplete, Select, TextField } from 'src/ui/core/components'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputLabel,
  Stack,
  Typography,
} from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { DocKind } from 'src/models/doc/doc.interface'
import IDomain from 'src/models/domain/domain.interface'
import TimeLimitSelect from 'src/ui/core/components/TimeLimitSelect/TimeLimitSelect'
import UnitSelect from '@components/UnitSelect/UnitSelect'
import _ from 'lodash'
import { localStateType } from './AssessmentType'
import { toJS } from 'mobx'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'

function AssessmentTypeView(props: any) {
  const { state, simulations, trainings, domains, docs } = props

  const localState = useLocalObservable(() => ({
    isEditMode: false,
  }))

  const {
    assessmentTypeStore,
    uiState: { assessmentTypes, windowDimensions },
  } = useRootStore()

  const filteredDomains = domains?.filter(
    (domain: IDomain) =>
      !['EC Reporting', 'IEC Reporting', 'IRB Reporting'].includes(domain.name)
  )

  const domainOptions = domains?.map((domain: any) => {
    return {
      text: domain.name,
      value: domain._id,
    }
  })

  useEffect(() => {
    if (assessmentTypeStore.form._id) {
      localState.isEditMode = true
    } else {
      localState.isEditMode = false
    }
  }, [])

  useEffect(() => {
    if (assessmentTypeStore.form.trainings.length > 0) return console.log('dev')
    if (localState.isEditMode === false) {
      filteredDomains.map((domain: IDomain) => {
        const training: localStateType['form']['training'] = _.cloneDeep(
          state.form.training
        )
        const followup = _.cloneDeep(state.form.followup)

        training.domain._id = domain._id
        training.domain.label = domain.name

        followup.domain._id = domain._id
        followup.domain.label = domain.name
        // @ts-ignore
        assessmentTypeStore.form.trainings.push(training)
        // @ts-ignore
        assessmentTypeStore.form.followups.push(followup)
      })
    }
  }, [])

  const simulationOptions = simulations?.map((simulation: any) => ({
    value: simulation._id,
    text: simulation.name,
  }))

  const trainingOptions = trainings?.map((training: any) => ({
    text: training.title,
    value: training._id,
  }))

  const protocolOptions = docs
    .filter((doc: any) => doc.kind === DocKind.Protocol)
    .map((protocol: any) => ({
      text: protocol.title,
      value: protocol._id,
    }))

  const instructionOptions = docs
    .filter((doc: any) => doc.kind === DocKind.Instruction)
    .map((instruction: any) => ({
      text: instruction.title,
      value: instruction._id,
    }))
  const studyDocumentOptions = docs
    .filter((doc: any) => doc.kind === DocKind.StudyDocument)
    .map((studyDocument: any) => ({
      text: studyDocument.title,
      value: studyDocument._id,
    }))

  const onClickAdd = () => {
    const selectedDomain = domains?.find(
      (domain: any) => domain._id === state.form.domainId
    )
    state.form.followup.domain._id = state.form.domainId
    state.form.training.domain._id = state.form.domainId
    state.form.followup.domain.label = selectedDomain?.name || 'Domain'
    state.form.training.domain.label = selectedDomain?.name || 'Domain'
    assessmentTypeStore.form.followups.push(toJS(state.form.followup))
    assessmentTypeStore.form.trainings.push(toJS(state.form.training))
  }

  const onClickDelete =
    (type: 'followups' | 'trainings', index: number) => () => {
      assessmentTypeStore.form[type].splice(index, 1)
    }

  return (
    <DetailLayout store={assessmentTypeStore} mutate={assessmentTypes.mutate}>
      <Box sx={{ bgcolor: 'rgb(242, 243, 243)' }}>
        <Grid
          container
          spacing={2}
          sx={{
            p: 2,
            pt: 0,
            height: windowDimensions.height - 60,
            overflow: 'scroll',
            mt: 1,
          }}
        >
          <Grid item xs={3}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              <CardHeader title="Common Information" />
              <CardContent>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel>Label</InputLabel>
                    <TextField
                      placeholder="Label"
                      state={assessmentTypeStore}
                      path="form.label"
                      variant="outlined"
                    />
                  </Stack>
                </Grid>
              </CardContent>
            </Card>
            <Card className="paper-grid" sx={{ p: 0, mt: 2 }}>
              <CardHeader title={'Baseline'} />
              <CardContent>
                <Stack spacing={1.5}>
                  <div>
                    <InputLabel sx={{ mb: 1 }}>Simulation</InputLabel>
                    <Select
                      // label="Simulation"
                      state={assessmentTypeStore}
                      options={simulationOptions}
                      path="form.baseline.simulationId"
                    />
                  </div>
                  <div>
                    <InputLabel sx={{ mb: 1 }}>Label</InputLabel>
                    <TextField
                      state={assessmentTypeStore}
                      path="form.baseline.label"
                      placeholder="Label"
                      variant="outlined"
                    />
                  </div>
                  <Box sx={{ display: 'flex' }}>
                    <div>
                      <InputLabel sx={{ mb: 1 }}>Test Time</InputLabel>
                      <TimeLimitSelect
                        state={assessmentTypeStore}
                        path="form.baseline.testTime"
                        sx={{ mr: 1.5 }}
                      />
                    </div>
                    <div>
                      <InputLabel sx={{ mb: 1 }}>Attempt Count</InputLabel>
                      <UnitSelect
                        state={assessmentTypeStore}
                        path="form.baseline.attemptCount"
                        unit="times"
                        sx={{ mr: 1.5 }}
                      />
                    </div>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <div>
                      <InputLabel sx={{ mb: 1 }}>Minimum Hour</InputLabel>
                      <TimeLimitSelect
                        state={assessmentTypeStore}
                        path="form.baseline.minimumHour"
                        sx={{ mr: 1.5 }}
                      />
                    </div>
                    <div>
                      <InputLabel sx={{ mb: 1 }}>Deadline</InputLabel>
                      <UnitSelect
                        state={assessmentTypeStore}
                        path="form.baseline.deadline"
                        unit="day"
                        sx={{ mr: 1.5 }}
                      />
                    </div>
                  </Box>
                  <div>
                    <InputLabel sx={{ mb: 1 }}>Study Document</InputLabel>
                    <Autocomplete
                      // label="StudyLogs"
                      state={assessmentTypeStore}
                      options={studyDocumentOptions}
                      path="form.baseline.studyLogIds"
                      className="jjj"
                    />
                  </div>
                  <div>
                    <InputLabel sx={{ mb: 1 }}>Instruction</InputLabel>
                    <Autocomplete
                      // label="Instruction"
                      state={assessmentTypeStore}
                      options={instructionOptions}
                      path="form.baseline.instructionIds"
                      className="jjj"
                    />
                  </div>
                  <div>
                    <InputLabel sx={{ mb: 1 }}>Protocol</InputLabel>
                    <Autocomplete
                      // label="Protocol"
                      state={assessmentTypeStore}
                      options={studyDocumentOptions}
                      path="form.baseline.protocolIds"
                      className="jjj"
                    />
                  </div>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid item xs={12} display="flex" justifyContent={'flex-end'} flexDirection="column">
          <Stack spacing={1}>
            <Button
              disabled={!state.form.domainId}
              onClick={onClickAdd}
              variant="contained"
              sx={{ bgcolor: green[500] }}
            >
              {!state.form.domainId ? 'Select Domain' : 'New Training/Followup'}
              New Training/Followup
            </Button>
            <Select
              fullWidth
              options={domainOptions}
              state={state}
              path="form.domainId"
              label="Domain"
            />
          </Stack>
        </Grid> */}
          <Grid item xs={3}>
            <Card className="paper-grid" sx={{ p: 1, pt: 0 }}>
              <CardHeader title="Training" />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {assessmentTypeStore.form.trainings?.map((training) => {
                    return (
                      <Card
                        sx={{ p: 1, mt: 2, borderRadius: '2px !important' }}
                      >
                        <Stack spacing={1}>
                          {/* @ts-ignore */}
                          <InputLabel sx={{}}>
                            {training.domain.label}
                          </InputLabel>
                          {/* <Typography>{training.domain.label}</Typography> */}
                          {/* <TextField
                            state={training}
                            path="label"
                            placeholder="label"
                            variant="outlined"
                          /> */}
                          <Select
                            label="Training"
                            options={trainingOptions}
                            state={training}
                            path="_id"
                            className="select"
                          />
                        </Stack>
                      </Card>
                    )
                  })}
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="paper-grid" sx={{ p: 1, pt: 0 }}>
              <CardHeader title="Followup" />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {assessmentTypeStore.form.followups.map((followup) => {
                    return (
                      <Card
                        sx={{ p: 1, mt: 2, borderRadius: '2px !important' }}
                      >
                        <Stack spacing={1}>
                          {/* @ts-ignore */}
                          {/* <Typography>{followup.domain.label}</Typography> */}
                          <InputLabel sx={{}}>
                            {followup.domain.label}
                          </InputLabel>
                          <Stack spacing={2} direction={'row'}>
                            <Grid item xs={3.8}>
                              <Select
                                label="Simulation"
                                options={simulationOptions}
                                state={followup}
                                path="simulationId"
                                className="select"
                              />
                            </Grid>
                            <Grid item xs={7.9}>
                              <TextField
                                state={followup}
                                path="label"
                                placeholder="label"
                                variant="outlined"
                              />
                            </Grid>
                          </Stack>
                          <Stack direction={'row'} spacing={2}>
                            <UnitSelect
                              fullWidth
                              label="Attempt Count"
                              state={followup}
                              path="attemptCount"
                              unit="times"
                            />
                            <TimeLimitSelect
                              fullWidth
                              label="test time"
                              state={followup}
                              path="testTime"
                            />
                            <TimeLimitSelect
                              fullWidth
                              label="Minimum hour"
                              state={followup}
                              path="minimumHour"
                            />
                            <UnitSelect
                              fullWidth
                              label="Deadline"
                              state={followup}
                              path="deadline"
                              unit="day"
                            />
                          </Stack>
                          <Stack direction={'row'} spacing={2}>
                            <Autocomplete
                              label="Study Documents"
                              state={followup}
                              options={studyDocumentOptions}
                              path="studyLogIds"
                              className="jjj"
                              fullWidth
                            />
                            <Autocomplete
                              label="Instructions"
                              state={followup}
                              options={instructionOptions}
                              path="instructionIds"
                              className="jjj"
                              fullWidth
                            />
                            <Autocomplete
                              label="Protocols"
                              state={followup}
                              options={studyDocumentOptions}
                              path="protocolIds"
                              className="jjj"
                              fullWidth
                            />
                          </Stack>
                        </Stack>
                      </Card>
                    )
                  })}
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DetailLayout>
  )
}
export default observer(AssessmentTypeView)
