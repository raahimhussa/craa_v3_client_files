import { Box, Button } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'
import { useEffect, useState } from 'react'
import { useStopwatch, useTimer } from 'react-timer-hook'

import Assessment from 'src/models/assessment'
import { AssessmentScorerType } from 'src/stores/ui/pages/assessment'
import Draggable from 'react-draggable'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import PDFViewer from './PDFViewer/PDFViewer'
import SelectDocument from '../SelectDocument/SelectDocument'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import { toJS } from 'mobx'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

function AssessmentTopBarView({
  userSimulation,
  assessment,
}: {
  userSimulation: UserSimulation
  assessment: Assessment
}) {
  const { noteStore } = useRootStore()
  const [simDocs, setSimDocs] = useState<(ISimDoc & { open: boolean })[]>([])

  const onClickOpenPDF = (_simDoc: ISimDoc) => {
    setSimDocs((prev) => {
      if (prev.find((_sd) => _sd._id === _simDoc._id)) {
        return [...prev].map((_sd) => {
          if (_sd._id === _simDoc._id) return { ..._sd, open: true }
          return { ..._sd }
        })
      }
      return [...prev, { ..._simDoc, open: true }]
    })
  }
  const onClickClosePDF = (_simDoc: ISimDoc) => {
    setSimDocs((prev) =>
      [...prev].map((_sd) => {
        if (_sd._id !== _simDoc._id) return _sd
        return { ..._sd, open: false }
      })
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Box sx={{ mr: 1 }}>
          <SelectDocument
            simulationId={userSimulation.simulationId}
            onClickOpenPDF={onClickOpenPDF}
          />
        </Box>
        <Button variant="contained">Roadmap</Button>
        <Button variant="text" color="info">
          monitoring notes :{' '}
          {toJS(noteStore.notes)
            ? toJS(noteStore.notes?.length ? noteStore.notes?.length : '-')
            : '-'}
        </Button>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Timer assessment={assessment} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <UserInitial />
      </Box>
      {simDocs.map((_simDoc) =>
        _simDoc.open ? (
          <PDFViewer
            title={`${_simDoc.title} / ${_simDoc.files[0]?.name}`}
            fileUrl={_simDoc.files[0]?.url}
            onClose={() => onClickClosePDF(_simDoc)}
          />
        ) : null
      )}
    </Box>
  )
}

const Timer = observer(({ assessment }: { assessment: IAssessment }) => {
  const {
    assessmentStore,
    routerStore,
    uiState: {
      assessment: { scorerType },
    },
  } = useRootStore()
  const navigate = useNavigate()
  // const { seconds, minutes, hours, start, pause, resume } = useTimer({
  //   expiryTimestamp: moment(new Date()).add(2, 'hour').toDate(),
  //   onExpire: () => console.log('end'),
  //   autoStart: true,
  // })
  const { seconds, minutes, hours, start, pause } = useStopwatch({
    autoStart: true,
    offsetTimestamp: new Date(
      new Date().setSeconds(
        new Date().getSeconds() +
          ((assessment[scorerType] as any).scoringTime
            ? (assessment[scorerType] as any).scoringTime
            : 0)
      )
    ),
  })
  const { enqueueSnackbar } = useSnackbar()
  const timer = useLocalObservable(() => ({
    state: 'start',
  }))

  useEffect(() => {
    start()
  }, [])

  useEffect(() => {
    if (scorerType === AssessmentScorerType.Adjudicator) return
    else
      (async () => {
        await axios.patch('v2/assessments', {
          filter: { _id: assessment._id },
          update: {
            $set: {
              [`${scorerType}.scoringTime`]:
                hours * 3600 + minutes * 60 + seconds,
            },
          },
        })
      })()
  }, [seconds % 5 === 0])

  const isNotAdjudicator = !(scorerType === AssessmentScorerType.Adjudicator)

  return (
    <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
      {isNotAdjudicator && (
        <Button
          onClick={() => {
            if (timer.state === 'pause') {
              timer.state = 'resume'
              start()
            } else {
              timer.state = 'pause'
              pause()
            }
          }}
          size="small"
          variant="outlined"
          color="info"
        >
          {timer.state === 'pause' ? 'resume' : 'pause'}
        </Button>
      )}
      {isNotAdjudicator && (
        <Button sx={{ mx: 1 }} variant="outlined" color="warning">
          {hours}: {minutes} : {seconds}
        </Button>
      )}
      <Button
        onClick={async () => {
          try {
            isNotAdjudicator
              ? await assessmentStore.submitScoring(assessment)
              : await assessmentStore.submitAdjudicate(assessment)
            isNotAdjudicator
              ? routerStore.router && routerStore.router('admin/scoring/score')
              : routerStore.router &&
                routerStore.router('admin/scoring/adjudicate')
            enqueueSnackbar('Successfully submitted', {
              variant: 'success',
            })
          } catch (error) {
            enqueueSnackbar('Submit failed', {
              variant: 'error',
            })
            console.error(error)
          }
        }}
        variant="contained"
      >
        Submit
      </Button>
    </Box>
  )
})

const UserInitial = observer(() => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
    >
      <Button variant="text">User Initails: JW2</Button>
    </Box>
  )
})

export default observer(AssessmentTopBarView)
