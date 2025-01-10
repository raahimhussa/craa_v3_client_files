import * as React from 'react'

import { SimulationType, UserSimulationStatus } from 'src/utils/status'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import UserSimulation from 'src/models/userSimulation'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

type Props = {
  userSimulation: UserSimulation
  userSimulationStore: any
  disabled: boolean
}

const DistributeDialog = observer(({ userSimulation, disabled }: Props) => {
  const [open, setOpen] = React.useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const onClickDistribute = async () => {
    try {
      if (userSimulation.simulationType === SimulationType.Baseline) {
        await axios.patch(
          `/v3/scoringManagement/userSimulations/${userSimulation._id}/baselineDistribute`
        )
      } else if (userSimulation.simulationType === SimulationType.Followup) {
        await axios.patch(
          `/v3/scoringManagement/userSimulations/${userSimulation._id}/followupDistribute`
        )
      }
      enqueueSnackbar('Distributed', { variant: 'success' })
    } catch (error) {
      return console.error(error)
    }
    handleClose()
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} disabled={disabled}>
        Distribute
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to mark {userSimulation.userId || 'unknown'}
          's {userSimulation._id} as 'Distributed' ?
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onClickDistribute} autoFocus>
            Distribute
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
})

export default DistributeDialog
