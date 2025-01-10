import {
  Box,
  Button,
  IconButton,
  InputBase,
  InputProps,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { observer, useLocalStore } from 'mobx-react'
import { useEffect, useState } from 'react'

import ILog from 'src/models/log/types'
import { Search } from '@mui/icons-material'
import Spacer from 'src/ui/core/components/Spacer/Spacer'
import moment from 'moment'
import palette from 'src/theme/palette'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'

const Notes = ({
  logs,
  recordId,
}: {
  logs: ILog[]
  userSimulationId: string
  recordId: any
}) => {
  const { screenRecorderStore, uiState } = useRootStore()
  const localState = useLocalStore(() => ({
    searchText: '',
  }))
  const [recordid, setRecordid] = useState('')
  useEffect(() => {
    setRecordid(recordId)
  }, [recordId])

  return (
    <Box
      sx={{
        height: uiState.windowDimensions.height - 180,
        overflowY: 'scroll',
      }}
    >
      {/* <SearchInput onChange={(e) => (localState.searchText = e.target.value)} />
      <Spacer spacing={2} /> */}
      <TableBody className="logtable">
        {logs.map((log) => {
          return (
            <TableRow
              hover
              key={uniqid()}
              sx={{
                bgcolor:
                  log.recordId != recordid
                    ? '#f2f2f2  !important'
                    : 'white !important',
                p: '2rem !important',
              }}
            >
              <TableCell
                sx={{
                  width: '80%',
                  borderBottom: '1px solid #cccccc !important',
                }}
              >
                {log.note?.type !== 'compliance' ? (
                  <Typography
                    sx={{
                      lineHeight: '1.4 !important',
                      fontSize: '14.5px',
                      p: 1,
                    }}
                  >
                    {' '}
                    {log.note?.text}
                  </Typography>
                ) : (
                  <Box sx={{ p: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography
                        sx={{
                          lineHeight: '1.4 !important',
                          fontSize: '14.5px',
                          width: '290px',
                          mr: 1,
                        }}
                      >
                        Number of capsules taken by subject
                      </Typography>
                      <Typography
                        sx={{
                          lineHeight: '1.4 !important',
                          fontSize: '14.5px',
                          border: '1px solid black',
                          borderColor: palette.light.divider,
                          py: 0.5,
                          width: '55px',
                          px: 0.5,
                        }}
                      >
                        {log.note?.complianceNote?.taken}
                      </Typography>
                    </Box>
                    {log.note?.complianceNote?.shouldTaken !== '' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          my: 1,
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          sx={{
                            lineHeight: '1.4 !important',
                            fontSize: '14.5px',
                            width: '290px',
                            mr: 1,
                          }}
                        >
                          Number of capsules than should have been <br />
                          taken by subject
                        </Typography>
                        <Typography
                          sx={{
                            lineHeight: '1.4 !important',
                            fontSize: '14.5px',
                            border: '1px solid black',
                            borderColor: palette.light.divider,
                            py: 0.5,
                            width: '55px',
                            px: 0.5,
                          }}
                        >
                          {log.note?.complianceNote?.shouldTaken}
                        </Typography>
                      </Box>
                    ) : (
                      <></>
                    )}
                    {log.note?.complianceNote?.percent !== '' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          sx={{
                            lineHeight: '1.4 !important',
                            fontSize: '14.5px',
                            width: '290px',
                            mr: 1,
                          }}
                        >
                          Percent Compliance
                        </Typography>
                        <Typography
                          sx={{
                            lineHeight: '1.4 !important',
                            fontSize: '14.5px',
                            border: '1px solid black',
                            borderColor: palette.light.divider,
                            py: 0.5,
                            width: '55px',
                            px: 0.5,
                          }}
                        >
                          {log.note?.complianceNote?.percent}%
                        </Typography>
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Box>
                )}
              </TableCell>
              <TableCell sx={{ borderBottom: '1px solid #cccccc !important' }}>
                {moment.utc(log.duration * 1000).format('HH:mm:ss')}
              </TableCell>
              <TableCell sx={{ borderBottom: '1px solid #cccccc !important' }}>
                <Button
                  // onClick={() => screenRecorderStore.play(log.duration, 0)}
                  onClick={() =>
                    screenRecorderStore.play(
                      log.duration,
                      logs[logs.length - 1].duration
                    )
                  }
                  variant="outlined"
                  size="small"
                  disabled={log.recordId != recordid}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Box>
  )
}

export default observer(Notes)

export const SearchInput = (props: InputProps) => {
  return (
    <Paper
      component="span"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flex: 1,
      }}
    >
      <InputBase {...props} sx={{ ml: 1, flex: 1 }} placeholder={`Search`} />
      <IconButton sx={{ p: '10px' }}>
        <Search />
      </IconButton>
    </Paper>
  )
}
