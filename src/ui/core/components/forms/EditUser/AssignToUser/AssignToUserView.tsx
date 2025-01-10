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
import { useEffect, useState } from 'react'

import { AssessmentCycle } from 'src/models/assessmentCycle'
import AssessmentType from 'src/models/assessmentType'
import ClientUnit from 'src/models/clientUnit'
import { ExpandMore } from '@mui/icons-material'
import SelectSimulations from './SelectSimulations/SelectSimulations'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import axios from 'axios'
import { observer } from 'mobx-react'

type Props = {
  userAssessmentCycles: UserAssessmentCycle[]
  userAssessmentCyclesMutate: any
  clientUnits: ClientUnit[]
  userId: string
}

function AssignToUserView(props: Props) {
  const {
    clientUnits,
    userAssessmentCycles,
    userAssessmentCyclesMutate,
    userId,
  } = props
  const [selectedOption, setSelectedOption] = useState<{
    clientUnitId: string
    businessUnitId: string
    businessCycleId: string
    assessmentTypeId: string
  }>({
    clientUnitId: '',
    businessUnitId: '',
    businessCycleId: '',
    assessmentTypeId: '',
  })

  const onHandleSelectedOption = (e: any) => {
    setSelectedOption((prev: any) => {
      switch (e.target.name) {
        case 'clientUnitId': {
          return {
            clientUnitId: e.target.value,
            businessUnitId: '',
            businessCycleId: '',
            assessmentTypeId: '',
          }
        }
        case 'businessUnitId': {
          return {
            ...prev,
            businessUnitId: e.target.value,
            businessCycleId: '',
            assessmentTypeId: '',
          }
        }
        case 'businessCycleId': {
          return {
            ...prev,
            businessCycleId: e.target.value,
            assessmentTypeId: '',
          }
        }
        case 'assessmentTypeId': {
          return {
            ...prev,
            assessmentTypeId: e.target.value,
          }
        }
        default: {
          break
        }
      }
    })
  }

  const onClickAdd = async () => {
    if (
      !selectedOption.clientUnitId ||
      !selectedOption.businessUnitId ||
      !selectedOption.businessCycleId ||
      !selectedOption.assessmentTypeId
    )
      return
    const body = {
      ...selectedOption,
      userId,
    }
    await axios.post('v1/users/addAssessmentCycle', body)
    userAssessmentCyclesMutate && (await userAssessmentCyclesMutate())
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
        <FormControl fullWidth sx={{ mb: 2, maxWidth: 500 }}>
          <InputLabel id="demo-simple-select-label">Client</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOption.clientUnitId}
            onChange={onHandleSelectedOption}
            size="small"
            name="clientUnitId"
          >
            {clientUnits.map((_clientUnit) => {
              return (
                <MenuItem key={_clientUnit._id} value={_clientUnit._id}>
                  {_clientUnit.name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2, maxWidth: 500 }}>
          <InputLabel id="demo-simple-select-label">Business Unit</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOption.businessUnitId}
            onChange={onHandleSelectedOption}
            size="small"
            name="businessUnitId"
          >
            {clientUnits
              ?.find(
                (_clientUnit) => _clientUnit._id === selectedOption.clientUnitId
              )
              ?.businessUnits?.map((_businessUnit) => {
                return (
                  <MenuItem key={_businessUnit._id} value={_businessUnit._id}>
                    {_businessUnit.name}
                  </MenuItem>
                )
              })}
          </Select>
        </FormControl>
        <FormControl sx={{ mb: 2, maxWidth: 500 }}>
          <InputLabel id="demo-simple-select-label">Business Cycle</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOption.businessCycleId}
            onChange={onHandleSelectedOption}
            size="small"
            name="businessCycleId"
          >
            {clientUnits
              ?.find(
                (_clientUnit) => _clientUnit._id === selectedOption.clientUnitId
              )
              ?.businessUnits?.find(
                (_businessUnit) =>
                  _businessUnit._id === selectedOption.businessUnitId
              )
              ?.businessCycles?.map((_businessCycle) => {
                return (
                  <MenuItem key={_businessCycle._id} value={_businessCycle._id}>
                    {(_businessCycle as any).assessmentCycle.name}
                  </MenuItem>
                )
              })}
          </Select>
        </FormControl>
        <FormControl sx={{ mb: 2, maxWidth: 500 }}>
          <InputLabel id="demo-simple-select-label">Assessment Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedOption.assessmentTypeId}
            onChange={onHandleSelectedOption}
            size="small"
            name="assessmentTypeId"
          >
            {(
              clientUnits
                ?.find(
                  (_clientUnit) =>
                    _clientUnit._id === selectedOption.clientUnitId
                )
                ?.businessUnits?.find(
                  (_businessUnit) =>
                    _businessUnit._id === selectedOption.businessUnitId
                )
                ?.businessCycles?.find(
                  (_businessCycle) =>
                    _businessCycle._id === selectedOption.businessCycleId
                ) as any
            )?.assessmentCycle.assessmentTypes?.map(
              (_assessmentType: AssessmentType) => {
                return (
                  <MenuItem
                    key={_assessmentType._id}
                    value={_assessmentType._id}
                  >
                    {(_assessmentType as AssessmentType).label}
                  </MenuItem>
                )
              }
            )}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex' }} onClick={onClickAdd}>
          <Box sx={{ maxWidth: 435, width: '100%' }} />
          <Button
            variant="contained"
            disabled={
              !selectedOption.clientUnitId ||
              !selectedOption.businessUnitId ||
              !selectedOption.businessCycleId ||
              !selectedOption.assessmentTypeId
            }
          >
            Add
          </Button>
        </Box>
      </Box>
      <Box>
        <SelectSimulations
          clientUnits={clientUnits}
          userAssessmentCycles={userAssessmentCycles}
          userAssessmentCyclesMutate={userAssessmentCyclesMutate}
        />
      </Box>
    </Box>
  )
}
export default observer(AssignToUserView)
