import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
  InputLabel,
} from '@mui/material'
import React, { useState } from 'react'

import RUnitSelectNumber from '@components/RUnitSelectNumber/RUnitSelectNumber'
import UnitSelect from '@components/UnitSelect/UnitSelect'
import { observer } from 'mobx-react'
import { useSnackbar } from 'notistack'

type ReopenDialogueProps = {
  open: boolean
  handleClose: () => void
  onReopen: (additionalTestTime: number, additionalAttemptCount: number) => void
  title: string
  text: string
  yesText: string
  noText: string
}

function ReopenDialogueView({
  open,
  handleClose,
  onReopen,
  title,
  text,
  yesText,
  noText,
}: ReopenDialogueProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [additionalTestTime, setAdditionalTestTime] = useState<number>(0)
  const [additionalAttemptCount, setAdditionalAttemptCount] =
    useState<number>(0)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
        <Box sx={{ display: 'flex', mt: 1 }}>
          <Box sx={{ mr: 1, width: 180 }}>
            <InputLabel sx={{ mb: 1 }}>Additional Test Time</InputLabel>
            <RUnitSelectNumber
              value={additionalTestTime}
              unit={'hour'}
              onChangeNumber={(amount) => setAdditionalTestTime(amount)}
            />
          </Box>
          <Box sx={{ width: 180 }}>
            <InputLabel sx={{ mb: 1 }}>Additional Attempt Count</InputLabel>
            <RUnitSelectNumber
              value={additionalAttemptCount}
              unit={'times'}
              onChangeNumber={(amount) => setAdditionalAttemptCount(amount)}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{noText}</Button>
        <Button
          onClick={async () => {
            try {
              await handleClose()
              await onReopen(additionalTestTime, additionalAttemptCount)
              enqueueSnackbar('Reopened successfully', { variant: 'success' })
            } catch (e) {
              console.error(e)
              enqueueSnackbar('Reopened failed', { variant: 'error' })
            }
          }}
          variant="contained"
          color="warning"
          autoFocus
        >
          {yesText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default observer(ReopenDialogueView)
