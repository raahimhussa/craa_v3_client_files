import { Box, Button, TableBody, TableCell, TableRow } from '@mui/material'
import { csCZ } from '@mui/material/locale'
import { observer } from 'mobx-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import Log from 'src/models/log'
import { useRootStore } from 'src/stores'
const Logs = ({ logs, recordId }: { logs: Log[]; recordId: any }) => {
  const { uiState, screenRecorderStore } = useRootStore()
  const [recordid, setRecordid] = useState('none')

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
      <TableBody className="logtable">
        {logs.map((log: any) => {
          return (
            <TableRow
              hover
              sx={{
                bgcolor:
                  log.recordId != recordid
                    ? '#f2f2f2  !important'
                    : 'white !important',
              }}
            >
              <TableCell
                sx={{
                  width: '80%',
                  //   color:
                  //     i != videoIndex
                  //       ? '#b3b3b3  !important'
                  //       : '#212B36 !important',
                }}
              >
                {log.event}
              </TableCell>
              <TableCell
              // sx={{
              //   color:
              //     i != videoIndex
              //       ? '#b3b3b3  !important'
              //       : '#212B36 !important',
              // }}
              >
                {moment.utc(log.duration * 1000).format('HH:mm:ss')}
              </TableCell>
              <TableCell>
                <Button
                  disabled={log.recordId != recordid}
                  onClick={() =>
                    screenRecorderStore.play(
                      log.duration,
                      logs[logs.length - 1].duration
                    )
                  }
                  variant="outlined"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
        {/* {data.map((arr, i) => {
          return (
            <>
              {arr.map((log: any) => {
                return (
                  <TableRow
                    hover
                    sx={{
                      bgcolor:
                        i != videoIndex
                          ? '#f2f2f2  !important'
                          : 'white !important',
                    }}
                  >
                    <TableCell
                      sx={{
                        width: '80%',
                        //   color:
                        //     i != videoIndex
                        //       ? '#b3b3b3  !important'
                        //       : '#212B36 !important',
                      }}
                    >
                      {log.event}
                    </TableCell>
                    <TableCell
                    // sx={{
                    //   color:
                    //     i != videoIndex
                    //       ? '#b3b3b3  !important'
                    //       : '#212B36 !important',
                    // }}
                    >
                      {moment.utc(log.duration * 1000).format('HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <Button
                        disabled={i != videoIndex}
                        onClick={() =>
                          screenRecorderStore.play(
                            log.duration,
                            logs[logs.length - 1].duration
                          )
                        }
                        variant="outlined"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </>
          )
        })} */}
      </TableBody>
    </Box>
  )
}

export default observer(Logs)
