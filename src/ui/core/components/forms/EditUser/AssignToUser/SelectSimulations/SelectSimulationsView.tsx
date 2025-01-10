import '@toast-ui/editor/dist/toastui-editor.css'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'

import { AssessmentCycle } from 'src/models/assessmentCycle'
import AssessmentType from 'src/models/assessmentType'
import ClientUnit from 'src/models/clientUnit'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import { ExpandMore } from '@mui/icons-material'
import SelectAssessmentTypes from './SelectAssessmentTypes/SelectAssessmentTypes'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserSimulation from 'src/models/userSimulation'
import UserTraining from 'src/models/userTraining'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

type Props = {
  clientUnits: ClientUnit[]
  userAssessmentCycles: UserAssessmentCycle[]
  userSimulations: UserSimulation[]
  userTrainings: UserTraining[]
  userSimulationsMutate: any
  userTrainingsMutate: any
}

function SelectSimulationsView(props: Props) {
  const {
    clientUnits,
    userAssessmentCycles,
    userSimulations,
    userTrainings,
    userSimulationsMutate,
    userTrainingsMutate,
  } = props
  const [openDeleteDialogue, setOpenDeleteDialogue] = useState<boolean>(false)

  const onClickOpenDeleteDialogue = (e: any) => {
    setOpenDeleteDialogue(true)
    e.stopPropagation()
  }

  const onClickCloseDeleteDialogue = (e: any) => {
    setOpenDeleteDialogue(false)
  }

  const onClickRemove = async (userAssessmentCycleId: string) => {
    try {
      await axios.delete(
        `v1/userAssessmentCycles/${userAssessmentCycleId}/cascade`
      )
      userSimulationsMutate && (await userSimulationsMutate())
    } catch (error) {
      console.error({ error })
      throw error
    }
  }

  return (
    <Box>
      {userAssessmentCycles.map((_userAssessmentCycle) => {
        const localUserAssessmentCycle =
          _userAssessmentCycle as UserAssessmentCycle & {
            assessmentCycle: AssessmentCycle
            assessmentType: AssessmentType
            userBaseline: UserSimulation
            userFollowups: UserSimulation[]
          }
        const clientUnit = clientUnits.find(
          (_clientUnit) =>
            _clientUnit._id === localUserAssessmentCycle.clientUnitId
        )
        const businessUnit = clientUnit?.businessUnits.find(
          (_businessUnit) =>
            _businessUnit._id === localUserAssessmentCycle.businessUnitId
        )
        const localUserBaseline = userSimulations.find(
          (_userSimulation) =>
            _userSimulation._id === _userAssessmentCycle.userBaselineId
        )
        const localUserFollowups = userSimulations.filter((_userSimulation) =>
          _userAssessmentCycle.userFollowupIds.includes(_userSimulation._id)
        )
        const localUserTrainings = userTrainings.filter((_userTraining) =>
          _userAssessmentCycle.userTrainingIds.includes(_userTraining._id)
        )

        if (
          !clientUnit ||
          !businessUnit ||
          !localUserBaseline ||
          !localUserFollowups ||
          !localUserTrainings
        ) {
          return null
        }
        // const businessCycle = businessUnit?.businessCycles.find(
        //   (_businessCycle) =>
        //     _businessCycle._id === localUserAssessmentCycle.businessCycleId
        // )
        return (
          <Accordion key={localUserAssessmentCycle._id}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontSize: '18px', fontWeight: '600' }}>
                  {`${clientUnit?.name} / ${businessUnit?.name} / ${localUserAssessmentCycle.assessmentCycle.name}`}
                </Typography>
                <Button variant="contained" onClick={onClickOpenDeleteDialogue}>
                  Remove
                </Button>
                <DeleteDialogue
                  open={openDeleteDialogue}
                  handleClose={onClickCloseDeleteDialogue}
                  onDelete={() => onClickRemove(_userAssessmentCycle._id)}
                  title={`Are you sure you want to delete "${clientUnit?.name} / ${businessUnit?.name} / ${localUserAssessmentCycle.assessmentCycle.name}"? `}
                  text={
                    "This item will be deleted immediately. You can't undo this action."
                  }
                  yesText={'Remove'}
                  noText={'Cancel'}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <SelectAssessmentTypes
                assessmentTypeIds={
                  localUserAssessmentCycle.assessmentCycle.assessmentTypeIds
                }
                userBaseline={localUserBaseline}
                userFollowups={localUserFollowups}
                userTrainings={localUserTrainings}
                userSimulationsMutate={userSimulationsMutate}
                userTrainingsMutate={userTrainingsMutate}
              />
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Box>
  )
}
export default observer(SelectSimulationsView)
