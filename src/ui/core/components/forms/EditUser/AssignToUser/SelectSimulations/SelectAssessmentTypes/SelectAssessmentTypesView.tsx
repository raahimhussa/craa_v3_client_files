import '@toast-ui/editor/dist/toastui-editor.css'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { TrainingStatus, UserSimulationStatus } from 'src/utils/status'

import { AssessmentCycle } from 'src/models/assessmentCycle'
import AssessmentType from 'src/models/assessmentType'
import ClientUnit from 'src/models/clientUnit'
import { ExpandMore } from '@mui/icons-material'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserSimulation from 'src/models/userSimulation'
import UserTraining from 'src/models/userTraining'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

type Props = {
  assessmentTypes: AssessmentType[]
  userBaseline: UserSimulation
  userFollowups: UserSimulation[]
  userTrainings: UserTraining[]
  userSimulationsMutate: any
  userTrainingsMutate: any
}

const getFormattedTime = (seconds: number) => {
  const hours = Math.floor(seconds / (60 * 60))
  const mins = Math.floor((seconds - hours * 60 * 60) / 60)
  const secs = seconds - hours * 60 * 60 - mins * 60
  return `${hours.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function SelectAssessmentTypesView(props: Props) {
  const {
    assessmentTypes,
    userBaseline,
    userFollowups,
    userTrainings,
    userSimulationsMutate,
    userTrainingsMutate,
  } = props
  const { enqueueSnackbar } = useSnackbar()

  const onClickUserSimulationUpdate = async (
    e: any,
    userSimulationId: string
  ) => {
    if (!userSimulationId) return
    try {
      await axios.patch('/v2/userSimulations', {
        filter: {
          _id: userSimulationId,
        },
        update: {
          $set: {
            status: e.target.checked
              ? UserSimulationStatus.Assigned
              : UserSimulationStatus.HasNotAssigned,
          },
        },
      })
      enqueueSnackbar('successfully updated', { variant: 'success' })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('update failed', { variant: 'error' })
    }

    userSimulationsMutate && (await userSimulationsMutate())
  }

  const onClickUserTrainingUpdate = async (e: any, userTrainingId: string) => {
    if (!userTrainingId) return
    try {
      await axios.patch('/v2/userTrainings', {
        filter: {
          _id: userTrainingId,
        },
        update: {
          $set: {
            status: e.target.checked
              ? TrainingStatus.HasNotStarted
              : TrainingStatus.HasNotAssigned,
          },
        },
      })
      enqueueSnackbar('successfully updated', { variant: 'success' })
    } catch (e) {
      console.error(e)
      enqueueSnackbar('update failed', { variant: 'error' })
    }

    userTrainingsMutate && (await userTrainingsMutate())
  }

  return (
    <Box sx={{ ml: 2 }}>
      {assessmentTypes.map((_assessmentType) => {
        return (
          <Box>
            <Box sx={{ mb: 2, fontSize: '16px', fontWeight: '600' }}>
              {_assessmentType.label}
            </Box>
            <Box sx={{ ml: 2 }}>
              <Box>
                <Box sx={{ fontSize: '16px', fontWeight: '500', mt: 1 }}>
                  Baseline
                  <Divider />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={
                      userBaseline.status !==
                      UserSimulationStatus.HasNotAssigned
                    }
                    onChange={(e) =>
                      onClickUserSimulationUpdate(e, userBaseline._id)
                    }
                  />
                  <Typography sx={{ width: '296px', mr: 2 }}>
                    {_assessmentType.baseline?.label}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#bbbbbb',
                      p: '4px',
                      borderRadius: 1,
                    }}
                  >
                    {getFormattedTime(userBaseline.testTime)}
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box sx={{ fontSize: '16px', fontWeight: '500', mt: 1 }}>
                  Trainings
                  <Divider />
                </Box>
                <Box>
                  {_assessmentType.trainings.map((_training: any) => {
                    const userTraining = userTrainings.find((_userTraining) => {
                      return _userTraining.domainId === _training.domain._id
                    })
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          checked={
                            userTraining?.status !==
                            TrainingStatus.HasNotAssigned
                          }
                          onChange={(e) =>
                            onClickUserTrainingUpdate(
                              e,
                              userTraining?._id || ''
                            )
                          }
                        />
                        <Typography sx={{ width: '296px', mr: 2 }}>
                          {_training.training?.title}
                        </Typography>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box>
                <Box sx={{ fontSize: '16px', fontWeight: '500', mt: 1 }}>
                  Followups
                  <Divider />
                </Box>
                <Box>
                  {_assessmentType.followups.map((_followup) => {
                    const userFollowup = userFollowups.find(
                      (_userFollowup) =>
                        _userFollowup.domainId === _followup.domain._id
                    )
                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          checked={
                            userFollowup?.status !==
                            UserSimulationStatus.HasNotAssigned
                          }
                          onChange={(e) =>
                            onClickUserSimulationUpdate(
                              e,
                              userFollowup?._id || ''
                            )
                          }
                        />
                        <Typography sx={{ width: '296px', mr: 2 }}>
                          {_followup.label}
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: '#bbbbbb',
                            p: '4px',
                            borderRadius: 1,
                          }}
                        >
                          {getFormattedTime(userFollowup?.testTime || 0)}
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Box>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <Divider sx={{ mt: 1, mb: 1 }} />
          </Box>
        )
      })}
    </Box>
  )
}
export default observer(SelectAssessmentTypesView)
