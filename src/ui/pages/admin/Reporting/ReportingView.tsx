import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  AnswerStatus,
  TrainingStatus,
  UserSimulationStatus,
} from 'src/utils/status'
import { Checkbox, Spacer } from '@components'
import { blue, green, grey, orange, yellow } from '@mui/material/colors'
import { observer, useLocalObservable } from 'mobx-react'

import Domain from 'src/models/domain'
import Preview from '@components/tables/ScoringManagement/inProgress/PreviewButton/Preview'
import ReactApexChart from 'react-apexcharts'
import ResultsSummary from './ResultSummary/ResultSummaryView'
import { ScoreByDomain } from 'src/models/userSimulation/userSimulation.interface'
import Simulations from './Simulations/Simulations'
import StatusSummary from './StatusSummary/StatusSummary'
import Trainings from './Trainings/Trainings'
import User from 'src/models/user'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserInfo from './UserInfo/UserInfo'
import UserSimulation from 'src/models/userSimulation'
import UserTraining from 'src/models/userTraining'
import { Utils } from '@utils'
import _ from 'lodash'
import { bgcolor } from '@mui/system'
import compose from '@shopify/react-compose'
import moment from 'moment'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

type ReportingViewProps = {
  userCardData: {
    user: User
    userBaseline: UserSimulation
    userTrainings: UserTraining[]
    userFollowups: UserSimulation[]
    domains: Domain[]
    byDomains: {
      domain: Domain
      userFollowup: UserSimulation
      userTraining: UserTraining
      userBaselineResultByMainDomain: ScoreByDomain
      userFollowupResultByMainDomain: ScoreByDomain
    }[]
  }[]
  userCardDataMutate: any
  domains: Domain[]
  userId: string
}

function ReportingView(props: ReportingViewProps) {
  const { userCardData, userCardDataMutate } = props
  const {
    uiState: { modal },
    uiState,
  } = useRootStore()
  const [radarStatus, setRadarStatus] = useState<number>(0)
  const [previewUserSimulationId, setPreviewUserSimulationId] =
    useState<string>('')

  const onClickBaselineViewResult = (userSimulationId: string) => {
    setRadarStatus(1)
    setPreviewUserSimulationId(userSimulationId)
  }

  const onClickFollowupViewResult = (userSimulationId: string) => {
    setRadarStatus(2)
    setPreviewUserSimulationId(userSimulationId)
  }

  const {
    windowDimensions: { height },
  } = uiState
  if (userCardData.length === 0) return null

  return (
    <Box>
      {userCardData.map((_userCardData) => (
        <Paper>
          <Spacer spacing={2} />
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Box sx={{ overflow: 'scroll', height: height, pb: 100 }}>
                <UserInfo
                  // user={_userCardData.user}
                  domains={props.domains}
                  userBaseline={_userCardData.userBaseline}
                  userFollowups={_userCardData.userFollowups}
                  radarStatus={radarStatus}
                />
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Box sx={{ overflow: 'scroll', height: height, pb: 100 }}>
                <Stack spacing={2}>
                  <Card variant="outlined">
                    <CardHeader title="Status Summary" />
                    <CardContent>
                      <StatusSummary
                        userBaseline={_userCardData.userBaseline}
                        byDomains={_userCardData.byDomains}
                      />
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardHeader title="Results Summary" />
                    <CardContent>
                      <ResultsSummary byDomains={_userCardData.byDomains} />
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardHeader title="Simulations" />
                    <CardContent>
                      <Simulations
                        userSimulations={[
                          _userCardData.userBaseline,
                          ..._userCardData.userFollowups.filter(
                            (_userFollowup) =>
                              _userFollowup.status !==
                              UserSimulationStatus.HasNotAssigned
                          ),
                        ]}
                        onClickBaselineViewResult={onClickBaselineViewResult}
                        onClickFollowupViewResult={onClickFollowupViewResult}
                        userCardDataMutate={userCardDataMutate}
                      />
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardHeader title="Trainings" />
                    <CardContent>
                      <Trainings
                        userTrainings={_userCardData.userTrainings.filter(
                          (_userTraining) =>
                            _userTraining.status !==
                            TrainingStatus.HasNotAssigned
                        )}
                        userFollowups={_userCardData.userFollowups}
                        domains={_userCardData.domains}
                      />
                    </CardContent>
                  </Card>
                  <Card variant="outlined">
                    <CardHeader title="" />
                    <CardContent>
                      {previewUserSimulationId ? (
                        <Preview userSimulationId={previewUserSimulationId} />
                      ) : null}
                    </CardContent>
                  </Card>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  )
}

export default observer(ReportingView)

// type FindingScoreViewProps = {
//   assessment: EnhancedAssessment
//   user: IUser
// }

// const FindingScoreView = observer((props: FindingScoreViewProps) => {
//   const { user, assessment } = props

//   return (
//     <Stack spacing={3}>
//       {/* @ts-ignore */}
//       <UserCard info user={user} assessment={assessment} />

//       <ResultsSummary baseline assessment={assessment} />

//       <Card>
//         <CardHeader title="Findings Score" />
//         <CardContent>
//           <Stack spacing={3}>
//             <Severity assessment={assessment} />
//             <Domains assessment={assessment} />
//           </Stack>
//         </CardContent>
//       </Card>
//     </Stack>
//   )
// })

// type SeverityProps = {
//   assessment: EnhancedAssessment
// }

// const Severity = observer((props: SeverityProps) => {
//   const { assessment } = props
//   const answersGroupedBySeverity = _.groupBy(
//     assessment.answers,
//     (answer) => answer.finding?.severity
//   )

//   const serverities = [
//     {
//       text: 'Critical',
//       value: FindingSeverity.Critical,
//     },
//     {
//       text: 'Major',
//       value: FindingSeverity.Major,
//     },
//     {
//       text: 'Minor',
//       value: FindingSeverity.Minor,
//     },
//   ]

//   return (
//     <Table>
//       <TableHead>
//         <TableRow>
//           <TableCell>Severity</TableCell>
//           <TableCell>% Identified</TableCell>
//           <TableCell>Identified</TableCell>
//           <TableCell>Not Identified</TableCell>
//           <TableCell>Total</TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {[
//           serverities.map((severity) => {
//             const correctAnswerCount = answersGroupedBySeverity[
//               severity.value
//             ]?.filter(
//               (answer) =>
//                 answer.scoring.firstScorer.answerStatus === AnswerStatus.Correct
//             ).length
//             const incorrectAnswerCount = answersGroupedBySeverity[
//               severity.value
//             ]?.filter(
//               (answer) =>
//                 answer.scoring.firstScorer.answerStatus ===
//                 AnswerStatus.InCorrect
//             ).length
//             const identified =
//               (correctAnswerCount /
//                 answersGroupedBySeverity[severity.value]?.length) *
//               100
//             return (
//               <TableRow>
//                 <TableCell>{severity.text}</TableCell>
//                 <TableCell>{Math.round(identified) || 0}</TableCell>
//                 <TableCell>{correctAnswerCount || 0}</TableCell>
//                 <TableCell>{incorrectAnswerCount || 0}</TableCell>
//                 <TableCell>
//                   {correctAnswerCount + incorrectAnswerCount || 0}
//                 </TableCell>
//               </TableRow>
//             )
//           }),
//         ]}
//       </TableBody>
//     </Table>
//   )
// })

// type ComplianceCalculationScoreViewProps = {}

// const ComplianceCalculationScoreView = observer(
//   (props: ComplianceCalculationScoreViewProps) => {
//     return (
//       <Card>
//         <CardHeader title="ComplianceCalculationScore" />
//         <CardContent>
//           <Grid container>
//             <Grid item xs={6}>
//               <Stack spacing={3}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Study Drug</TableCell>
//                       <TableCell>% Correct</TableCell>
//                       <TableCell>Correct</TableCell>
//                       <TableCell>InCorrect</TableCell>
//                       <TableCell>Total</TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     <TableRow>
//                       <TableCell>Number of pills taken by subject</TableCell>
//                       <TableCell>100%</TableCell>
//                       <TableCell>2</TableCell>
//                       <TableCell>0</TableCell>
//                       <TableCell>2</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>
//                         Number of pills that should have been taken by subject{' '}
//                       </TableCell>
//                       <TableCell>100%</TableCell>
//                       <TableCell>2</TableCell>
//                       <TableCell>0</TableCell>
//                       <TableCell>2</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>Percent(%) Compliance </TableCell>
//                       <TableCell>100%</TableCell>
//                       <TableCell>2</TableCell>
//                       <TableCell>0</TableCell>
//                       <TableCell>2</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>

//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Rescure Medication</TableCell>
//                       <TableCell>% Correct</TableCell>
//                       <TableCell>Correct</TableCell>
//                       <TableCell>InCorrect</TableCell>
//                       <TableCell>Total</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>Number of pills taken by subject</TableCell>
//                       <TableCell>100%</TableCell>
//                       <TableCell>2</TableCell>
//                       <TableCell>0</TableCell>
//                       <TableCell>2</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </Stack>
//             </Grid>
//             <Grid item xs={6}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Calculation</TableCell>
//                     <TableCell>Result</TableCell>
//                     <TableCell>CRA Input</TableCell>
//                     <TableCell>Answer Key</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   <TableRow>
//                     <TableCell variant="head" colSpan={4}>
//                       Subject LAT Study Medication Returned at Visit 3
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell>Number of pills taken by subject</TableCell>
//                     <TableCell>100%</TableCell>
//                     <TableCell>2</TableCell>
//                     <TableCell>0</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell variant="head" colSpan={4}>
//                       Subject LAT Study Medication Returned at Visit 13-ET
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell>Number of pills taken by subject</TableCell>
//                     <TableCell>100%</TableCell>
//                     <TableCell>2</TableCell>
//                     <TableCell>0</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell variant="head" colSpan={4}>
//                       Subject LAT Rescue Medication Returned at Visit 3
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell>Number of pills taken by subject</TableCell>
//                     <TableCell>100%</TableCell>
//                     <TableCell>2</TableCell>
//                     <TableCell>0</TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell variant="head" colSpan={4}>
//                       Subject LAT Rescue Medication Returned at Visit 13-ET
//                     </TableCell>
//                   </TableRow>
//                   <TableRow>
//                     <TableCell>Number of pills taken by subject</TableCell>
//                     <TableCell>100%</TableCell>
//                     <TableCell>2</TableCell>
//                     <TableCell>0</TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </Grid>
//           </Grid>
//         </CardContent>
//       </Card>
//     )
//   }
// )

// const ComplianceCalculationScore = compose<any>()(
//   ComplianceCalculationScoreView
// )

// const ProcessIssuesView = observer(() => {
//   return (
//     <Card>
//       <CardHeader title="Process Issues" />
//       <CardContent>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Process</TableCell>
//               <TableCell>Result</TableCell>
//               <TableCell>Documents</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             <TableRow>
//               <TableCell>Documents not reviewed</TableCell>
//               <TableCell>0</TableCell>
//               <TableCell></TableCell>
//             </TableRow>
//             <TableRow>
//               <TableCell>Non-errors identified by CRA</TableCell>
//               <TableCell>0</TableCell>
//               <TableCell></TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// })

// export const ProcessIssues = compose<any>()(ProcessIssuesView)

// type UnidentifiedFindingsViewProps = {
//   assessment: EnhancedAssessment
// }

// const UnidentifiedFindingsView = observer(
//   (props: UnidentifiedFindingsViewProps) => {
//     const { assessment } = props

//     const incorrectAnswers = assessment.answers?.filter(
//       (answer) =>
//         answer.scoring.firstScorer.answerStatus === AnswerStatus.InCorrect
//     )

//     const serverities = [
//       {
//         text: 'Critical',
//         value: FindingSeverity.Critical,
//       },
//       {
//         text: 'Major',
//         value: FindingSeverity.Major,
//       },
//       {
//         text: 'Minor',
//         value: FindingSeverity.Minor,
//       },
//     ]

//     return (
//       <Card>
//         <CardHeader title="Unidentified Findings" />
//         <CardContent>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Findings Not Identified</TableCell>
//                 <TableCell>Severity</TableCell>
//                 <TableCell>Domain</TableCell>
//                 <TableCell>Document1</TableCell>
//                 <TableCell>Document2</TableCell>
//                 <TableCell>Document3</TableCell>
//                 <TableCell>Evaluation</TableCell>
//                 <TableCell>Relevant ICH-GCP</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {incorrectAnswers.map((answer) => {
//                 if (!answer?.finding) return null
//                 return (
//                   <TableRow>
//                     <TableCell>{answer.finding.text}</TableCell>
//                     <TableCell>
//                       {
//                         serverities.find(
//                           (severity) =>
//                             severity.value === answer.finding?.severity
//                         )?.text
//                       }
//                     </TableCell>
//                     {/* @ts-ignore */}
//                     <TableCell>
//                       {answer.finding.domain?.name || 'Unknown'}
//                     </TableCell>
//                     <TableCell>Document1</TableCell>
//                     <TableCell>Document2</TableCell>
//                     <TableCell>Document3</TableCell>
//                     <TableCell>N/A</TableCell>
//                     <TableCell>{answer.finding.ich_gcp}</TableCell>
//                   </TableRow>
//                 )
//               })}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     )
//   }
// )

// const UnidentifiedFindings = compose<any>()(UnidentifiedFindingsView)

// type MonitoringNotesViewProps = {
//   assessment: EnhancedAssessment
// }

// const MonitoringNotesView = observer((props: MonitoringNotesViewProps) => {
//   const { assessment } = props
//   return (
//     <Card>
//       <CardHeader title="Monitoring Notes" />
//       <CardContent>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Create Order</TableCell>
//               <TableCell>Document</TableCell>
//               <TableCell>Monitoring Note</TableCell>
//               <TableCell>Non-Error Comment</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {assessment.answers?.map((answer, index) => {
//               return (
//                 <TableRow>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{answer.note?.viewport?.simDoc?.title}</TableCell>
//                   <TableCell>{answer.note?.text}</TableCell>
//                   <TableCell></TableCell>
//                 </TableRow>
//               )
//             })}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   )
// })

// const Confidential = observer(() => {
//   return (
//     <Alert severity="warning">
//       <AlertTitle>The information in this document is confidential.</AlertTitle>
//     </Alert>
//   )
// })

// const MonitoringNotes = compose<any>()(MonitoringNotesView)

// const FindingScore = compose<any>()(FindingScoreView)
