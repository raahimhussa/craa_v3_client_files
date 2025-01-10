import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import IUser, { LocalUser } from 'src/models/user/user.interface'
import { useEffect, useState } from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Folder from 'src/models/folder'
import IDomain from 'src/models/domain/domain.interface'
import Rainbow from 'rainbowvis.js'
import ReactApexChart from 'react-apexcharts'
import { ScoreByDomain } from 'src/models/userSimulation/userSimulation.interface'
import SimDoc from 'src/models/simDoc'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Log from 'src/models/log'
import ApexCharts from 'apexcharts'
import ClearIcon from '@mui/icons-material/Clear'

type UserInfoProps = {
  user: IUser & LocalUser
  userSimulation: UserSimulation
  domains: IDomain[]
  radarStatus: number
  folders: Folder[]
  logs: Log[]
  setIsLoading: any
  isLoading: boolean
}

export default observer((props: UserInfoProps) => {
  const { logs, userSimulation, setIsLoading, isLoading } = props
  const { userSimulationStore, simDocStore, folderStore } = useRootStore()
  const [show, setShow] = useState({
    isShow: false,
    width: 0,
    log: {
      note: { type: {}, viewport: { index: 0 }, text: '' },
      viewports: [[], [], []],
    },
  })
  const [series, setSeries] = useState([])
  const [notes, setNotes] = useState({
    add: [],
    save: [],
    compliance: [],
    delete: [],
  })

  useEffect(() => {
    const noteLogs = logs.filter(
      (log: any) =>
        log.event === 'saveNote' ||
        log.event === 'addNote' ||
        log.event === 'deleteNote'
    )
    let arr: any = []
    let deleteArr: any = []
    let addArr: any = []
    let compianceArr: any = []
    let saveArr: any = []
    let noteArr: any = { add: [], save: [], compliance: [], delete: [] }
    noteLogs.map((log: any) => {
      if (log.event === 'deleteNote') {
        deleteArr.push([
          log.duration * 1000,
          log.note.viewport.index == 0
            ? 3
            : log.note.viewport.index == 1
            ? 2
            : 1,
        ])
        noteArr['delete'].push(log)
      } else if (log.event === 'addNote') {
        if (log.note.type === 'monitoring') {
          addArr.push([
            log.duration * 1000,
            log.note.viewport.index == 0
              ? 3
              : log.note.viewport.index == 1
              ? 2
              : 1,
          ])
          noteArr['add'].push(log)
        } else {
          compianceArr.push([
            log.duration * 1000,
            log.note.viewport.index == 0
              ? 3
              : log.note.viewport.index == 1
              ? 2
              : 1,
          ])
          noteArr['compliance'].push(log)
        }
      } else if (log.note.type === 'saveNote') {
        saveArr.push([
          log.duration * 1000,
          log.note.viewport.index == 0
            ? 3
            : log.note.viewport.index == 1
            ? 2
            : 1,
        ])
        noteArr['save'].push(log)
      }
    })
    arr.push({
      name: 'add',
      data: addArr,
    })
    arr.push({
      name: 'save',
      data: saveArr,
    })
    arr.push({
      name: 'compliance',
      data: compianceArr,
    })
    arr.push({
      name: 'delete',
      data: deleteArr,
    })
    setSeries(arr)
    setNotes(noteArr)
  }, [])

  const options: any = {
    chart: {
      height: 350,
      type: 'scatter',
      zoom: {
        enabled: false,
        type: 'xy',
      },
      events: {
        dataPointMouseEnter: function (
          event: any,
          chartContext: any,
          config: any
        ) {
          console.log(chartContext)
          console.log(config)
          const typeArr: any = ['add', 'save', 'compliance', 'delete']
          const type = typeArr[config.seriesIndex]
          //@ts-ignore
          const duration = notes[type][config.dataPointIndex]?.duration
          setShow({
            isShow: true,
            width: duration * 1000,
            //@ts-ignore
            log: notes[type][config.dataPointIndex],
          })
          console.log(duration)
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      type: 'datetime',
      max: userSimulation.usageTime * 1000,
      labels: {
        show: false,
      },
    },
    yaxis: {
      max: 3,
      min: 1,
      tickAmount: 3,
      labels: {
        show: false,
      },
    },
    colors: ['#0099ff', '#00b33c', '#00ffff', '#ff3300'],
    tooltip: {
      enabled: false,
    },
  }

  return (
    <>
      {isLoading ? (
        <Skeleton variant="rectangular" width={'100%'} height={80} />
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Stack
            spacing={3}
            sx={{ px: 1, width: '100%', position: 'relative' }}
          >
            <Card
              sx={{
                pl: '4.5rem',
                position: 'relative',
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  top: 20,
                  left: 15,
                  fontSize: '11px',
                }}
              >
                Viewport 1
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  top: 39,
                  left: 15,
                  fontSize: '11px',
                }}
              >
                Viewport 2
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  top: 57,
                  left: 15,
                  fontSize: '11px',
                }}
              >
                Viewport 3
              </Typography>
              <ReactApexChart
                options={options}
                series={series}
                type="scatter"
                height={80}
              />
            </Card>
            {show.isShow ? (
              <Box
                className="tooltip"
                sx={{
                  position: 'absolute',
                  bottom: -200,
                  bgcolor: '#484848',
                  borderRadius: '6px',
                  p: 1,
                  height: '200px',
                  width: '400px',
                  left: `${
                    (show.width / (userSimulation.usageTime * 1000)) * 100
                  }%`,
                }}
              >
                <Button
                  sx={{
                    position: 'absolute',
                    p: '0 !important',
                    right: 6,
                    minWidth: '20px',
                    height: '20px !important',
                  }}
                  onClick={() => {
                    //@ts-ignore
                    setShow({ isShow: false, width: 0, log: {} })
                  }}
                >
                  <ClearIcon
                    sx={{
                      fontSize: 17,
                    }}
                  />
                </Button>
                <Typography>
                  <span>Action : </span> {show.log.note.type} note on VP
                  {show.log.note.viewport.index + 1}
                </Typography>
                <Typography>
                  <span>VP1 : </span>
                  {/* @ts-ignore */}
                  {show.log.viewports[0].simDoc?.title}
                </Typography>
                <Typography>
                  <span>VP2 : </span>
                  {/* @ts-ignore */}
                  {show.log.viewports[1].simDoc?.title}
                </Typography>
                <Typography>
                  <span>VP3 : </span>
                  {/* @ts-ignore */}
                  {show.log.viewports[2].simDoc?.title}
                </Typography>
                <Typography>
                  <span>Page :</span> {/* @ts-ignore */}
                  {show.log.viewports[2].simDoc?.currentPage}
                </Typography>
                <Typography>
                  <span>Note : </span> {show.log.note.text}
                </Typography>
              </Box>
            ) : (
              <></>
            )}
          </Stack>
        </Box>
      )}
    </>
  )
})
