import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import Badge, { BadgeProps } from '@mui/material/Badge'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useRef, useState } from 'react'

import Bookmarks from './Bookmarks/Bookmarks'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import Logs from './_Logs/Logs'
import NoteAltIcon from '@mui/icons-material/NoteAlt'
import NoteIcon from '@mui/icons-material/Note'
import Notes from './Notes/Notes'
import Video from './Video'
import axios from 'axios'
import { grey } from '@mui/material/colors'
import moment from 'moment'
import palette from 'src/theme/palette'
import { styled } from '@mui/material/styles'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import { writeFile } from 'fs/promises'

function ScreenRecordsView({
  screenRecorder,
  userSimulationId,
  type,
  notes,
}: any) {
  const {
    uiState,
    screenRecorderStore,
    uiState: { modal },
  } = useRootStore()
  const [url, setUrl] = useState<object[]>([])
  const [noteCnt, setNoteCnt] = useState<any>({})
  const [isDone, setIsDone] = useState(false)
  // const localState = useLocalObservable(() => ({
  //   url: '',
  //   file: null,
  //   progress: 0,
  //   isLoading: true,
  //   message: '',
  //   totalChunkCount: screenRecorder.recorders.length,
  //   downloadChunkCount: 0,
  // }))

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -1,
      top: 4,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }))

  // useEffect(() => {
  //   const responseType = 'arraybuffer'

  //   const progressCallback = (progress: number) => {
  //     localState.progress = progress
  //     if (localState.progress > 90) {
  //       localState.isLoading = false
  //     }
  //   }
  //   const getData = async (screenRecord: any) => {
  //     const { data } = await axios.get(screenRecord, { responseType })
  //     return data
  //   }
  //   const getBlobs = async (arr: any) => {
  //     // const results = await Utils.allProgress(screenRecorder.recorders.map(getData), progressCallback)
  //     // const results = await Promise.all(screenRecorder.recorders.map(getData))
  //     const urlArr = []
  //     for (let index = 0; index < arr.urls.length; index++) {
  //       let fileName = arr.urls.url?.split('_')
  //       urlArr.push(
  //         fileName[0] + '_' + fileName[1] + '_' + (index + 1) + '.webm'
  //       )
  //     }
  //     const result = await Promise.all(urlArr.map(getData))
  //     const _file = new Blob(result, { type: 'video/webm' })
  //     const url = URL.createObjectURL(_file)
  //     localState.downloadChunkCount = localState.downloadChunkCount + 1
  //     let noteCnt = 0
  //     notes.map((note: any) => {
  //       if (note.recordId == arr.info.recordId) {
  //         noteCnt++
  //       }
  //     })
  //     return {
  //       url: url,
  //       recordId: arr.info.recordId,
  //       startSec: arr.info.startSec,
  //       noteCnt: noteCnt,
  //     }
  //   }

  //   const getUrl = async () => {
  //     const results = await Promise.all(screenRecorder.recorders.map(getBlobs))
  //     // const video = new Blob(results, { type: 'video/webm' })
  //     // const url = URL.createObjectURL(video)
  //     // localState.url = results[0]
  //     setUrl(results)
  //   }

  //   getUrl()
  // }, [])

  const screenRecords = uiState.screenRecords
  // const ratio = localState.downloadChunkCount / localState.totalChunkCount
  async function checkFileExists(fileKey: string) {
    const param = {
      fileKey: fileKey,
    }
    const data = await axios.post('http://0.0.0.0:4001/v1/isExist', param)
    // console.log(isExist)
    return data
  }

  useEffect(() => {
    let obj: any = {}
    screenRecorder.recorders.map((record: any) => {
      const recordId = record.info.recordId
      checkFileExists(`${userSimulationId}_${recordId}`).then((res) => {
        if (!res.data) {
          const param = {
            userSimulationId: userSimulationId,
            recordId: recordId,
          }
          axios.post('http://0.0.0.0:4001/v1/createVideo', param)
        }
      })
      let cnt = 0
      notes.map((note: any) => {
        if (note.recordId === recordId) {
          cnt++
        }
      })
      obj[recordId] = cnt
    })
    setNoteCnt(obj)
  }, [])
  const [expanded, setExpanded] = useState<string | false>(false)
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  return (
    <div style={{ height: '100%' }}>
      <Box
        sx={{
          bgcolor: palette.light.background.header,
          display: 'flex',
          justifyContent: 'space-between',
          pb: 3.5,
          alignItems: 'center',
          pt: 1.3,
        }}
      >
        <Typography sx={{ color: 'white', fontWeight: 700, pl: 2 }}>
          Screen Logs
        </Typography>
        <Button
          sx={{ color: 'white', mr: 1 }}
          onClick={() => {
            modal.close()
          }}
        >
          Close
        </Button>
      </Box>
      <Grid
        container
        spacing={2}
        className="logModal"
        sx={{
          bgcolor: grey[100],
          height: '100%',
          p: 2,
        }}
      >
        <Grid
          item
          xs={7}
          sx={{
            height: '92%',
            overflowY: 'scroll',
            paddingTop: '0 !important',
          }}
        >
          {/* <LinearProgress variant="determinate" value={100 * ratio} /> */}
          {screenRecorder.recorders.map((record: any, i: any) => (
            <div>
              <Accordion
                expanded={expanded === record.info.recordId}
                onChange={handleChange(record.info.recordId)}
                sx={{ borderRadius: '2px !important' }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100% !important',
                    }}
                  >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                      video&nbsp;-&nbsp;{i + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', mr: 3, alignItems: 'center' }}>
                      <IconButton>
                        <StyledBadge
                          badgeContent={noteCnt[record.info.recordId]}
                          color="warning"
                          showZero
                        >
                          <NoteIcon />
                        </StyledBadge>
                      </IconButton>
                      <Typography
                        sx={{
                          flexShrink: 0,
                          ml: 1,
                          width: '75px',
                          textAlign: 'right',
                        }}
                      >
                        {moment
                          .utc(record.info.startSec * 1000)
                          .format('HH:mm:ss')}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {expanded === record.info.recordId ? (
                    <Video
                      url={`https://craa-sr-data.s3.us-east-2.amazonaws.com/${userSimulationId}_${record.info.recordId}.webm`}
                      index={i}
                      recordId={record.info.recordId}
                    />
                  ) : (
                    <></>
                  )}
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </Grid>
        <Grid
          item
          xs={5}
          sx={{ paddingTop: '0 !important', height: '92% !important' }}
        >
          <Paper
            sx={{
              p: 2,
              borderRadius: '2px',
              height: '100%',
            }}
          >
            <Tabs
              value={screenRecords.selectedTab().text}
              sx={{ flex: 1, display: 'flex' }}
            >
              {screenRecords.tabs.map((tab: any) => {
                return (
                  <Tab
                    sx={{ flex: 1 }}
                    key={uniqid()}
                    value={tab.text}
                    label={tab.text}
                    onClick={() => screenRecords.onClickTab(tab.text)}
                  />
                )
              })}
            </Tabs>
            {screenRecords.tabs[0].selected && (
              <Logs
                userSimulationId={userSimulationId}
                type={type}
                recordId={expanded}
              />
            )}
            {screenRecords.tabs[1].selected && (
              <Notes
                userSimulationId={userSimulationId}
                type={type}
                recordId={expanded}
              />
            )}
            {screenRecords.tabs[2].selected && (
              <Bookmarks userSimulationId={userSimulationId} type={type} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}
export default observer(ScreenRecordsView)
