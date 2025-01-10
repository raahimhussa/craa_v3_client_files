import { AssessmentStatus, ScorerStatus } from 'src/utils/status'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import { IAssessment } from 'src/models/assessment/assessment.interface'
import { PATH_ADMIN } from 'src/routes/paths'
import { Utils } from '@utils'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { red } from '@mui/material/colors'
import { styled } from 'src/experiments/styles/stitches.config'
import uniqid from 'uniqid'
import { useNavigate } from 'react-router-dom'
import { useRootStore } from 'src/stores'
import { useUser } from '@hooks'

const sections = [
  'Expedited',
  'All done & ready to score(followup not existed)',
  'Simulations ready to score',
  'Simulation Done',
]

function ScoringsView(props: {
  assessments: IAssessment[]
  assessment: IAssessment
}) {
  const _assessments = props.assessments

  return (
    <Box>
      {sections?.map((section) => (
        <ScoringCard
          key={uniqid()}
          section={section}
          assessments={_assessments}
        />
      ))}
    </Box>
  )
}

const ScoringCard = observer(
  ({
    section,
    assessments,
  }: {
    section: string
    assessments: IAssessment[]
  }) => {
    const { data } = useUser()
    const renderAssessment = (assessment: IAssessment) => {
      return <AssessmentRow key={uniqid()} assessment={assessment} />
    }
    const bySection = (section: string, assessment: IAssessment) => {
      const scorerType = (): 'firstScorer' | 'secondScorer' | null => {
        switch (data._id) {
          case assessment.firstScorer._id: {
            return 'firstScorer'
          }
          case assessment.secondScorer._id: {
            return 'secondScorer'
          }
        }
        return null
      }
      const _scorerType = scorerType()
      if (!_scorerType) return false
      switch (section) {
        case sections[0]:
          return (
            assessment.status != AssessmentStatus.Complete &&
            assessment.isExpedited
          )
        case sections[1]:
          break
        case sections[2]: {
          return (
            !assessment.isExpedited &&
            assessment[_scorerType]?.status !== ScorerStatus.Complete
          )
        }
        case sections[3]: {
          return assessment[_scorerType]?.status === ScorerStatus.Complete
        }
        default:
          break
      }
    }
    return (
      <Card sx={{ mt: 2, p: 0 }} className="paper-grid">
        <CardHeader title={section} />
        <CardContent>
          <Table>
            <TableHead>
              <Header />
            </TableHead>
            <TableBody>
              {assessments
                ?.filter((assessment) => bySection(section, assessment))
                ?.map(renderAssessment)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }
)

const Header = observer(() => {
  return (
    <TableRow>
      <TableCell sx={{ py: '8px !important', lineHeight: '1.5 !important' }}>
        Date Remaining
      </TableCell>
      <TableCell>Initial</TableCell>
      <TableCell>Simulation</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  )
})

const AssessmentRow = observer(
  ({ assessment }: { assessment: IAssessment }) => {
    const { authStore } = useRootStore()

    const navigate = useNavigate()

    const onClick = () => {
      navigate(
        `${PATH_ADMIN.scorings.score}/userSimulations/${assessment.userSimulationId}`
      )
    }

    let scorer: {
      _id: string
      status: ScorerStatus
    } = {
      _id: '',
      status: ScorerStatus.HasNotStarted,
    }

    if (authStore.isLoading || !authStore.user) return null

    const isFirstScorer = authStore.user._id === assessment.firstScorer._id
    const isSecondScorer = authStore.user._id === assessment.secondScorer._id

    if (isFirstScorer) {
      scorer._id = authStore.user._id
      scorer.status = assessment.firstScorer.status
    } else if (isSecondScorer) {
      scorer._id = authStore.user._id
      scorer.status = assessment.secondScorer.status
    } else {
      return null
    }

    return (
      <TableRow>
        <TableCell
          sx={{
            pl: '0 !important',
            py: '8px !important',
            lineHeight: '1.5 !important',
          }}
        >
          -{Utils.generateRandom()}
        </TableCell>
        <TableCell sx={{ pl: '0 !important' }}>
          user name
          {/* {assessment.user.name} */}
        </TableCell>
        <TableCell sx={{ pl: '0 !important' }}>
          simulation name
          {/* {assessment.simulation.name} */}
        </TableCell>

        <TableCell sx={{ pl: '0 !important' }}>
          <ButtonGroup sx={{ mr: 3 }}>
            <Button
              disabled={scorer.status === ScorerStatus.Complete ? true : false}
              variant="contained"
              onClick={onClick}
              sx={{
                bgcolor: 'rgb(29, 129, 2) !important',
                borderColor: 'rgb(29, 129, 2) !important',
                fontSize: '13px !important',
                pt: 0,
                pb: 0,
                height: '25px !important',
              }}
            >
              {scorer.status === ScorerStatus.HasNotStarted
                ? 'Start'
                : scorer.status}
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: 'rgb(0, 115, 187) !important',
                borderColor: 'rgb(0, 115, 187) !important',
                pt: 0,
                pb: 0,
                height: '25px !important',
                fontSize: '13px !important',
              }}
            >
              Preview
            </Button>

            <Button
              variant="outlined"
              sx={{
                color: 'rgb(236, 114, 17) !important',
                borderColor: 'rgb(236, 114, 17) !important',
                pt: 0,
                pb: 0,
                height: '25px !important',
                fontSize: '13px !important',
              }}
            >
              Roadmap
            </Button>
          </ButtonGroup>
          {assessment.isExpedited && <Expedited>Expedited</Expedited>}
        </TableCell>
      </TableRow>
    )
  }
)

const Expedited = styled('div', {
  height: 32,
  width: 100,
  background: red[600],
  borderRadius: 30,
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  fontWeight: 700,
})

export default observer(ScoringsView)
