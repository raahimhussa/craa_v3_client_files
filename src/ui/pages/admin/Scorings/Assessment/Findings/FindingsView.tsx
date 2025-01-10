import {
  Alert,
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material'
import {
  Circle,
  CircleOutlined,
  Close,
  ExitToApp,
  FeedbackOutlined,
} from '@mui/icons-material'
// import { Select, Spacer } from '@components'
import { green, grey, red, yellow } from '@mui/material/colors'
import { observable, reaction, toJS } from 'mobx'
import { useEffect, useState } from 'react'

import { AnswerStatus } from 'src/utils/status'
import { AssessmentScorerType } from 'src/stores/ui/pages/assessment'
import Finding from 'src/models/finding'
import { FolderName } from '../MNotes/MNotesView'
import IAnswer from 'src/models/answer/answer.interface'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import IFinding from 'src/models/finding/finding.interface'
import { INote } from 'src/models/note/note.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import { KeyedMutator } from 'swr'
import Note from 'src/models/note'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

function FindingsView(props: {
  simDocsByFolderId: { [folderId: string]: { findings: Finding[] }[] }
  notes: Note[]
  assessment: IAssessment
}) {
  const folderIds = Object.keys(props.simDocsByFolderId)

  return (
    <Table className="scoring_table">
      <TableHead>
        <Header />
      </TableHead>
      <TableBody sx={{ overflow: 'auto' }}>
        {folderIds.map((_folderId) => {
          return (
            <FolderName key={uniqid()} folderId={_folderId}>
              {props.simDocsByFolderId[_folderId].map((_simDoc, i) => {
                return _simDoc.findings.map((finding) => (
                  <FindingRow
                    key={`${_folderId}-${i}-${finding._id}`}
                    finding={finding}
                    notes={props.notes}
                    assessment={props.assessment}
                  />
                ))
              })}
            </FolderName>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default observer(FindingsView)

const FindingRowView = observer(
  ({
    finding,
    notes,
    answer,
    answerMutate,
    assessment,
  }: {
    assessment: IAssessment
    finding: IFinding
    notes: INote[]
    answer: IAnswer
    answerMutate: KeyedMutator<any>
  }) => {
    const {
      uiState: {
        assessment: { scorerType },
      },
    } = useRootStore()

    const [isTooltipOpened, setIsTooltipOpened] = useState<boolean>(false)

    const isAdjudicator = scorerType === AssessmentScorerType.Adjudicator

    const isFirstScorer = scorerType === AssessmentScorerType.FirstScorer

    const isSecondScorer = scorerType === AssessmentScorerType.SecondScorer
    const hasAdjudicated =
      answer?.scoring?.adjudicator.answerStatus !== AnswerStatus.NotScored

    const isNeededToAdjudicate =
      (answer?.scoring?.firstScorer.answerStatus !==
        answer?.scoring?.secondScorer.answerStatus ||
        answer?.scoring?.firstScorer.noteId !==
          answer?.scoring?.secondScorer.noteId) &&
      (answer?.scoring?.adjudicator.answerStatus === AnswerStatus.NotScored ||
        (answer?.scoring?.adjudicator.answerStatus === AnswerStatus.Correct &&
          !answer?.scoring?.adjudicator.noteId))

    if (!answer) return null
    return (
      <TableRow
        selected={isAdjudicator && (hasAdjudicated || isNeededToAdjudicate)}
        sx={{
          backgroundColor: isAdjudicator
            ? isNeededToAdjudicate
              ? '#fff429 !important'
              : hasAdjudicated
              ? '#d3ffb1 !important'
              : undefined
            : undefined,
        }}
      >
        <TableCell>
          {isAdjudicator && (isNeededToAdjudicate || hasAdjudicated) && (
            <ThemeTooltip
              open={isTooltipOpened}
              title={
                <Box>
                  <Button
                    onClick={() => setIsTooltipOpened(false)}
                    sx={{ zIndex: 10 }}
                  >
                    <Close />
                  </Button>
                  <Box display={'flex'}>
                    <MNID
                      disabled
                      notes={notes}
                      answer={answer}
                      answerMutate={answerMutate}
                      scorerType={AssessmentScorerType.FirstScorer}
                      sx={{ height: 30 }}
                    />
                    <Answer
                      disabled
                      answer={answer}
                      answerMutate={answerMutate}
                      scorerType={AssessmentScorerType.FirstScorer}
                    />
                  </Box>
                  <Box display={'flex'}>
                    <MNID
                      disabled
                      notes={notes}
                      answer={answer}
                      answerMutate={answerMutate}
                      scorerType={AssessmentScorerType.SecondScorer}
                      sx={{ height: 30 }}
                    />
                    <Answer
                      disabled
                      answer={answer}
                      answerMutate={answerMutate}
                      scorerType={AssessmentScorerType.SecondScorer}
                    />
                  </Box>
                </Box>
              }
              placement="left"
            >
              <button
                onClick={() => setIsTooltipOpened(true)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid grey',
                  cursor: 'pointer',
                  margin: '0px 4px 0px 4px',
                  width: '28px',
                  height: '28px',
                }}
              >
                <FeedbackOutlined />
              </button>
            </ThemeTooltip>
          )}
        </TableCell>
        <TableCell>
          <MNID
            notes={notes}
            answer={answer}
            answerMutate={answerMutate}
            scorerType={scorerType}
          />
        </TableCell>
        <TableCell align="center">
          <Answer
            answer={answer}
            answerMutate={answerMutate}
            scorerType={scorerType}
          />
        </TableCell>

        <TableCell>
          <Typography sx={{ fontSize: '13.8px', textAlign: 'left', pl: 0.3 }}>
            {finding.text}
          </Typography>
        </TableCell>
      </TableRow>
    )
  }
)

const ThemeTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => {
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.neutral,
    },
  }
})

const getAnswerFilter = ({
  assessment,
  finding,
}: {
  assessment: IAssessment
  finding: IFinding
}) => {
  return {
    assessmentId: assessment._id,
    findingId: finding._id,
    status: {
      $in: [
        AnswerStatus.Correct,
        AnswerStatus.InCorrect,
        AnswerStatus.NotScored,
      ],
    },
  }
}
const FindingRow = compose<any>(
  withFindOne({
    isDocNeeded: false,
    collectionName: 'answers',
    getFilter: getAnswerFilter,
    version: 2,
    uiStoreKey: 'answer',
  })
)(FindingRowView)

const MNID = observer(
  ({
    disabled,
    notes,
    answer,
    answerMutate,
    scorerType,
    sx,
  }: {
    disabled?: boolean
    notes: INote[]
    answer?: IAnswer
    answerMutate: KeyedMutator<any>
    scorerType: AssessmentScorerType
    sx?: any
  }) => {
    if (!answer) return null
    const { answerStore } = useRootStore()

    const { enqueueSnackbar } = useSnackbar()

    const defaultNoteId = () => {
      if (answer.scoring[scorerType].noteId)
        return answer.scoring[scorerType].noteId
      if (
        scorerType === AssessmentScorerType.Adjudicator &&
        answer.scoring[AssessmentScorerType.FirstScorer].noteId ===
          answer.scoring[AssessmentScorerType.SecondScorer].noteId
      ) {
        return answer.scoring[AssessmentScorerType.FirstScorer].noteId
      }
      return null
    }

    const state = observable({
      noteId: defaultNoteId(),
    })

    const mnIdOptions = notes
      ?.sort((a, b) => (a.MNID - b.MNID > 0 ? 1 : -1))
      .map((note) => ({
        text: note.MNID,
        value: note._id,
      }))

    reaction(
      () => state.noteId,
      async (noteId) => {
        try {
          if (noteId) {
            await answerStore.connectNoteIdToAnswer(
              answer._id,
              noteId,
              scorerType
            )
            enqueueSnackbar('Connected', { variant: 'success' })
          } else {
            await answerStore.connectNoteIdToAnswer(answer._id, '', scorerType)
            enqueueSnackbar('Disconnected', { variant: 'success' })
          }
        } catch (error) {
          return enqueueSnackbar('error!', { variant: 'error' })
        }
        answerMutate && answerMutate()
      }
    )

    return (
      <Box>
        <Select
          disabled={
            disabled ||
            answer.scoring[scorerType].answerStatus === AnswerStatus.InCorrect
          }
          sx={{ width: 96, ...sx }}
          // options={mnIdOptions}
          // state={state}
          value={answer.scoring[scorerType].noteId}
          // path="noteId"
          onChange={(e) => (state.noteId = e.target.value)}
        >
          {mnIdOptions.map((_mnIdOption) => {
            return (
              <MenuItem value={_mnIdOption.value} key={_mnIdOption.value}>
                {_mnIdOption.text}
              </MenuItem>
            )
          })}
        </Select>
      </Box>
    )
  }
)

const Header = observer(() => {
  return (
    <TableRow>
      <TableCell sx={{ width: '64px !important' }} />
      <TableCell sx={{ width: '64px !important' }}>MN ID</TableCell>
      <TableCell align="center" sx={{ width: '80px !important' }}>
        Status
      </TableCell>

      <TableCell>Findings</TableCell>
    </TableRow>
  )
})

const Answer = observer(
  ({
    disabled,
    answer,
    answerMutate,
    noteId,
    scorerType,
  }: {
    disabled?: boolean
    answer?: IAnswer
    noteId?: string
    answerMutate?: KeyedMutator<any>
    scorerType: AssessmentScorerType
  }) => {
    if (!answer) return null

    const { enqueueSnackbar } = useSnackbar()

    const { answerStore } = useRootStore()

    const getColor = (status: AnswerStatus) => {
      switch (status) {
        case AnswerStatus.Correct:
          return green[500]
        case AnswerStatus.InCorrect:
          return red[500]
        case AnswerStatus.NotScored:
          return grey[500]
        default:
          return grey[500]
      }
    }
    const isNeededToAdjudicate =
      answer?.scoring.firstScorer.answerStatus !==
        answer?.scoring.secondScorer.answerStatus ||
      answer?.scoring.firstScorer.noteId !== answer?.scoring.secondScorer.noteId

    const buttons = [
      {
        type: AnswerStatus.Correct,
        color: getColor(AnswerStatus.Correct),
        active:
          scorerType === AssessmentScorerType.Adjudicator
            ? isNeededToAdjudicate
              ? answer.scoring.adjudicator.answerStatus === AnswerStatus.Correct
              : answer.scoring.firstScorer.answerStatus === AnswerStatus.Correct
            : answer.scoring[scorerType].answerStatus === AnswerStatus.Correct,
        onClick: async () => {
          try {
            await answerStore.markAsCorrect(answer._id, scorerType)
            answerMutate && answerMutate()
          } catch (error) {
            throw error
          }
        },
      },
      {
        type: AnswerStatus.InCorrect,
        color: getColor(AnswerStatus.InCorrect),
        active:
          scorerType === AssessmentScorerType.Adjudicator
            ? isNeededToAdjudicate
              ? answer.scoring.adjudicator.answerStatus ===
                AnswerStatus.InCorrect
              : answer.scoring.firstScorer.answerStatus ===
                AnswerStatus.InCorrect
            : answer.scoring[scorerType].answerStatus ===
              AnswerStatus.InCorrect,
        onClick: async () => {
          try {
            await answerStore.markAsIncorrect(answer._id, scorerType)
            answerMutate && answerMutate()
          } catch (error) {
            throw error
          }
        },
      },
    ]

    const onClickButton = async (button: any) => {
      if (disabled) return
      try {
        await button.onClick()
      } catch (error) {
        return enqueueSnackbar('Error!', { variant: 'error' })
      }

      answerMutate && answerMutate()

      enqueueSnackbar('Success', { variant: 'success' })
    }

    return (
      <Box sx={{ display: 'flex' }}>
        {buttons.map((button) => {
          return (
            <IconButton key={button.type} onClick={() => onClickButton(button)}>
              {button.active ? (
                <Circle
                  htmlColor={getColor(answer.scoring[scorerType].answerStatus)}
                />
              ) : (
                <CircleOutlined htmlColor={button.color} />
              )}
            </IconButton>
          )
        })}
      </Box>
    )
  }
)
