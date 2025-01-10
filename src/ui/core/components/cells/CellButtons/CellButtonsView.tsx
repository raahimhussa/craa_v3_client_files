import * as React from 'react'

import {
  AppBar,
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Badge,
  Delete,
  Edit,
  FormatListBulleted,
  Lock,
  LockOpen,
} from '@mui/icons-material'
import { observer, useLocalObservable } from 'mobx-react'

import ButtonGroup from '@mui/material/ButtonGroup'
import { CellProps } from 'react-table'
import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import { RootStore } from 'src/stores/root'
import SimCard from 'src/ui/pages/admin/SimCard/SimCard'
import Swal from 'sweetalert2'
import UiState from 'src/stores/ui'
import UserSimulationRepository from 'src/repos/v2/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import { UserStore } from 'src/stores/userStore'
import { blue } from '@mui/material/colors'
import compose from '@shopify/react-compose'
import green from '@mui/material/colors/green'
import palette from 'src/theme/palette'
import red from '@mui/material/colors/red'
import { useRootStore } from 'src/stores'
import { useState } from 'react'
import yellow from '@mui/material/colors/yellow'

function CellButtonsView(props: CellProps<any>) {
  const Props = {
    cellProps: props,
    userId: props.row.original.user?._id,
  }
  const {
    column: { edit, remove, storeKey, mutateKey, name },
  }: any = props
  const _storeKey: keyof RootStore = storeKey
  const _mutateKey: keyof UiState = mutateKey
  const rootStore = useRootStore()
  const { userStore, assessmentTypeStore, userSimulationStore } = useRootStore()

  const [open, setOpen] = React.useState(false)
  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState<boolean>(false)
  const [testTime, setTestTime] = React.useState(
    Math.floor(props.row.original.assessmentType?.baseline.testTime / 3600)
  )
  const [attemptCnt, setAttemptCnt] = React.useState(
    props.row.original.assessmentType?.baseline.attemptCount
  )

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onClickEdit = () => {
    rootStore[_storeKey].form = props.row.original
    edit({ ...props })
  }
  const onClickActivate = async () => {
    const query = {
      filter: { email: props.row.original.email },
      update: {
        isActivated: !props.row.original.isActivated,
      },
    }
    try {
      await userStore.repository.update(query)
    } catch (error) {
      return rootStore.uiState.alert.error()
    }
    Swal.fire({
      title: props.row.original.isActivated ? 'Deactivated' : 'Activated',
      icon: 'success',
    })
    const ui: any = rootStore.uiState[_mutateKey]
    ui.mutate && ui.mutate()
  }

  const onClickSubmit = async (type: string) => {
    if (type == 'baseline') {
      try {
        const baselineQuery = {
          filter: { _id: props.row.original.userSimulationId },
          update: {
            status: UserSimulationStatus.Complete,
          },
        }
        await userSimulationStore.repository.update(baselineQuery)
      } catch (error) {
        return rootStore.uiState.alert.error()
      }
    } else {
      // try {
      //   const followupQuery = {
      //     filter: { _id: props.row.original.userSimulationId },
      //     update: {
      //       status: 'inProgress',
      //       usageTime: 0,
      //       attemptCount: props.row.original.assessmentType.baseline.attemptCount,
      //     },
      //   }
      //   await userSimulationStore.repository.update(followupQuery)
      // } catch (error) {
      //   return rootStore.uiState.alert.error()
      // }
    }
    Swal.fire({
      title: 'Submitted!',
      icon: 'success',
    })
    const ui: any = rootStore.uiState[_mutateKey]
    ui.mutate && ui.mutate()
  }

  const onClickReopen = async (type: string) => {
    if (attemptCnt < 0) {
      alert('Invalid attempt count.')
      return false
    }
    if (testTime < 0) {
      alert('Invalid test time.')
      return false
    }
    if (type == 'baseline') {
      try {
        const baselineQuery = {
          filter: { _id: props.row.original.userSimulationId },
          update: {
            status: 'inProgress',
            attemptCount: attemptCnt,
            testTime: testTime * 3600,
          },
        }
        await userSimulationStore.repository.update(baselineQuery)
      } catch (error) {
        return rootStore.uiState.alert.error()
      }
    } else {
      // try {
      //   const followupQuery = {
      //     filter: { _id: props.row.original.userSimulationId },
      //     update: {
      //       status: 'inProgress',
      //       usageTime: 0,
      //       attemptCount: props.row.original.assessmentType.baseline.attemptCount,
      //     },
      //   }
      //   await userSimulationStore.repository.update(followupQuery)
      // } catch (error) {
      //   return rootStore.uiState.alert.error()
      // }
    }
    Swal.fire({
      title: 'Reopened!',
      icon: 'success',
    })
    const ui: any = rootStore.uiState[_mutateKey]
    ui.mutate && ui.mutate()
  }

  const handleDeleteDialogueOpen = () => {
    setDeleteDialogueOpen(true)
  }

  const handleDeleteDialogueClose = () => {
    setDeleteDialogueOpen(false)
  }

  const onClickDelete = async () => {
    rootStore[_storeKey].form = props.row.original
    if (remove) {
      await remove({ ...props })
    } else {
      try {
        if (_storeKey === 'userStore') {
          await rootStore[_storeKey].delete(true)
        } else {
          await rootStore[_storeKey].delete()
        }
      } catch (error) {
        return rootStore.uiState.alert.error()
      }
    }
    const ui = rootStore.uiState[_mutateKey]
    // @ts-ignore

    ui.mutate && ui.mutate()
  }
  if (mutateKey === 'userAssessmentCycles' || mutateKey == 'userSimulation') {
    if (props.row.original.userSimulation != undefined) {
      return (
        <>
          <ButtonGroup>
            {props.row.original.userSimulation?.status ==
            UserSimulationStatus.Complete ? (
              <Button
                variant="contained"
                sx={{
                  fontSize: '12px',
                  borderRadius: '2px !important',
                  backgroundColor: palette.light.button.blue,
                  height: '36px',
                }}
                onClick={handleClickOpen}
                size="small"
              >
                Reopen
              </Button>
            ) : props.row.original.userSimulation?.status ==
              UserSimulationStatus.InProgress ? (
              <Button
                variant="contained"
                sx={{
                  fontSize: '12px',
                  borderRadius: '2px !important',
                  backgroundColor: palette.light.button.yellow,
                  height: '36px',
                }}
                size="small"
                onClick={() => {
                  onClickSubmit('baseline')
                }}
              >
                Submit
              </Button>
            ) : (
              <></>
            )}
            {/* <SimCardView cellProps={props} /> */}
            <UserReportingCardView cellProps={props} />
          </ButtonGroup>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ mb: 1 }}>Setting</DialogTitle>
            <DialogContent sx={{ pb: 0 }}>
              <TextField
                label="test time"
                type="number"
                variant="outlined"
                size="small"
                sx={{ my: 2, width: '100%' }}
                value={testTime}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">hour</InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(newValue) =>
                  setTestTime(Number(newValue.target.value))
                }
              />

              <TextField
                label="Attempt Count"
                type="number"
                variant="outlined"
                size="small"
                value={attemptCnt}
                sx={{ width: '100%' }}
                onChange={(newValue) =>
                  setAttemptCnt(Number(newValue.target.value))
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  onClickReopen('baseline')
                }}
              >
                Reopen
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )
    } else {
      return (
        <>
          <ButtonGroup>
            {props.row.original.status == UserSimulationStatus.Complete ? (
              <Button
                variant="contained"
                sx={{
                  fontSize: '12px',
                  borderRadius: '2px !important',
                  backgroundColor: palette.light.button.blue,
                  height: '36px',
                }}
                onClick={handleClickOpen}
                size="small"
              >
                Reopen
              </Button>
            ) : props.row.original.status == UserSimulationStatus.InProgress ? (
              <Button
                variant="contained"
                sx={{
                  fontSize: '12px',
                  borderRadius: '2px !important',
                  backgroundColor: palette.light.button.yellow,
                  height: '36px',
                }}
                size="small"
                onClick={() => {
                  onClickSubmit('baseline')
                }}
              >
                Submit
              </Button>
            ) : (
              <></>
            )}
            {/* <SimCardView cellProps={props} /> */}
            <UserReportingCardView cellProps={props} />
          </ButtonGroup>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ mb: 1 }}>Setting</DialogTitle>
            <DialogContent sx={{ pb: 0 }}>
              <TextField
                label="test time"
                type="number"
                variant="outlined"
                size="small"
                sx={{ my: 2, width: '100%' }}
                value={testTime}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">hour</InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(newValue) =>
                  setTestTime(Number(newValue.target.value))
                }
              />

              <TextField
                label="Attempt Count"
                type="number"
                variant="outlined"
                size="small"
                value={attemptCnt}
                sx={{ width: '100%' }}
                onChange={(newValue) =>
                  setAttemptCnt(Number(newValue.target.value))
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={() => {
                  ;() => {
                    onClickReopen('followup')
                  }
                }}
              >
                Reopen
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )
    }
  } else if (mutateKey == 'userStatus') {
    return (
      <IconButton
        onClick={onClickDelete}
        sx={{
          backgroundColor: palette.light.button.green,
          borderRadius: '2px !important',
          ml: 1,
        }}
      >
        <Badge htmlColor="white" />
      </IconButton>
    )
  } else if (mutateKey == 'users') {
    return (
      <ButtonGroup>
        <IconButton onClick={onClickEdit}>
          <Edit htmlColor={palette.light.button.blue} />
        </IconButton>
        <IconButton onClick={onClickActivate}>
          {props.row.original.isActivated ? (
            <Lock htmlColor={palette.light.button.yellow} />
          ) : (
            <LockOpen htmlColor={palette.light.button.green} />
          )}
        </IconButton>
        <IconButton onClick={handleDeleteDialogueOpen}>
          <Delete htmlColor={palette.light.button.red} />
        </IconButton>
        <DeleteDialogue
          open={deleteDialogueOpen}
          handleClose={handleDeleteDialogueClose}
          onDelete={onClickDelete}
          title={`Are you sure you want to delete ${
            name
              ? `"${name.length > 20 ? name.substring(0, 20) + '...' : name}"`
              : 'item'
          }?`}
          text={
            "This item will be deleted immediately. You can't undo this action."
          }
          yesText={'Delete'}
          noText={'Cancel'}
        />
      </ButtonGroup>
    )
  } else {
    return (
      <ButtonGroup>
        <IconButton onClick={onClickEdit}>
          <Edit htmlColor={palette.light.button.blue} />
        </IconButton>
        <IconButton onClick={handleDeleteDialogueOpen}>
          <Delete htmlColor={palette.light.button.red} />
        </IconButton>
        <DeleteDialogue
          open={deleteDialogueOpen}
          handleClose={handleDeleteDialogueClose}
          onDelete={onClickDelete}
          title={`Are you sure you want to delete ${
            name
              ? `"${name.length > 20 ? name.substring(0, 20) + '...' : name}"`
              : 'item'
          }?`}
          text={
            "This item will be deleted immediately. You can't undo this action."
          }
          yesText={'Delete'}
          noText={'Cancel'}
        />
      </ButtonGroup>
    )
  }
}
export default observer(CellButtonsView)

const UserReportingCardView = observer((cellProps: any) => {
  const state = useLocalObservable(() => ({
    isOpen: false,
  }))
  const onClcikReporting = () => {
    state.isOpen = true
  }

  const onClickClose = () => {
    state.isOpen = false
  }

  return (
    <>
      <IconButton
        sx={{
          backgroundColor: green[700],
          borderRadius: '2px !important',
          ml: 1,
          '&:hover': {
            bgcolor: green[900],
          },
        }}
        size="small"
        onClick={onClcikReporting}
      >
        <Badge htmlColor={yellow[50]} />
      </IconButton>
      <Modal open={state.isOpen}>
        <Box>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Reporting
              </Typography>
              <Button onClick={onClickClose} color="inherit">
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <Reporting userId={cellProps.row?.original.user._id} />
        </Box>
      </Modal>
    </>
  )
})

export const UserReportingCard = compose<any>()(UserReportingCardView)

const SimCardView = observer((cellProps: any) => {
  const state = useLocalObservable(() => ({
    isOpen: false,
  }))
  const onClcikCard = () => {
    state.isOpen = true
  }

  const onClickClose = () => {
    state.isOpen = false
  }

  return (
    <>
      <IconButton
        onClick={onClcikCard}
        sx={{
          backgroundColor: green[500],
          borderRadius: '2px !important',
          ml: 1,
          '&:hover': {
            bgcolor: green[900],
          },
        }}
        size="small"
      >
        <FormatListBulleted htmlColor={yellow[50]} />
      </IconButton>
      <Modal open={state.isOpen}>
        <Box>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Simulation Card
              </Typography>
              <Button onClick={onClickClose} color="inherit">
                Close
              </Button>
            </Toolbar>
          </AppBar>
          <SimCard
            userId={cellProps.row?.original.user._id}
            props={cellProps}
          />
        </Box>
      </Modal>
    </>
  )
})

export const UserSimCard = compose<any>()(SimCardView)
