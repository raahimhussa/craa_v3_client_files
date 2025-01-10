import {
  Box,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Switch,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material'
import { Lock, LockOpen, LockRounded } from '@mui/icons-material'
import { observer, useLocalObservable } from 'mobx-react'

import Bookmark from 'src/models/bookmark'
import Button from 'src/ui/core/components/mui/inputs/Button/Button'
import IBookmark from 'src/models/bookmark/types'
import Log from 'src/models/log'
import Spacer from 'src/ui/core/components/Spacer/Spacer'
import moment from 'moment'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'
const Notes = ({
  bookmarks,
  userSimulationId,
  bookmarksMutate,
}: {
  bookmarks: IBookmark[]
  userSimulationId: string
  bookmarksMutate: any
}) => {
  const { uiState, bookmarkStore, screenRecorderStore } = useRootStore()
  const localState = useLocalObservable(() => ({
    checked: false,
  }))

  const _bookmarks = bookmarks.filter((bookmark) => {
    if (localState.checked) {
      if (bookmark.isPrivate) {
        return true
      } else {
        return false
      }
    }
    return true
  })

  return (
    <Box
      sx={{ height: uiState.windowDimensions.height - 200, overflow: 'scroll' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', flex: 1, mt: 2 }}>
        <TextField
          multiline
          minRows={3}
          sx={{ mr: 1 }}
          fullWidth
          onChange={(e) => {
            bookmarkStore.bookmark.isPrivate = false
            bookmarkStore.setText(e.target.value)
          }}
          value={bookmarkStore.bookmark.text}
          size="small"
        />
        <Button
          size="small"
          onClick={async () => {
            await bookmarkStore.add(userSimulationId)
            bookmarksMutate()
          }}
          sx={{ width: '20%' }}
          variant="contained"
          color="primary"
        >
          ADD
        </Button>
      </Box>

      <Box>
        <FormLabel>
          {bookmarkStore.bookmark.isPrivate ? 'Private' : 'Public'}
        </FormLabel>
        <Switch
          onChange={(e, checked) =>
            (bookmarkStore.bookmark.isPrivate = checked)
          }
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Checkbox
          value={localState.checked}
          onChange={(e, checked) => (localState.checked = checked)}
        />
        <FormLabel>Only Private</FormLabel>
      </Box>

      <TableBody>
        {_bookmarks?.map((bookmark) => {
          return (
            <TableRow hover>
              <TableCell sx={{ width: '80%' }}>{bookmark.text}</TableCell>
              <TableCell>
                <IconButton>
                  {bookmark.isPrivate ? <Lock /> : <LockOpen />}
                </IconButton>
              </TableCell>
              <TableCell>
                {moment.utc(bookmark.duration * 1000).format('HH:mm:ss')}
              </TableCell>
              <TableCell>
                <ButtonGroup>
                  <Button
                    size="small"
                    onClick={() =>
                      screenRecorderStore.play(bookmark.duration, 0)
                    }
                    variant="outlined"
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={async () => {
                      await bookmarkStore.delete(bookmark._id)
                      await bookmarksMutate()
                    }}
                    variant="outlined"
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Box>
  )
}

export default observer(Notes)
