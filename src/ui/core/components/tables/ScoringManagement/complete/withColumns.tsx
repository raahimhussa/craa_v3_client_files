import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { AppBar, IconButton, Modal, Toolbar } from '@mui/material'
import {
  AssessmentStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import { Badge, Circle } from '@mui/icons-material'
import { Button, Typography } from 'src/ui/core/components'
import { green, yellow } from '@mui/material/colors'
import { observer, useLocalObservable } from 'mobx-react'

import Assessment from 'src/models/assessment'
import Box from '@mui/material/Box'
import { CellProps } from 'react-table'
// import { EnhancedAssessment } from 'src/ui/pages/admin/Reporting/ReportingView'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import PreviewButton from './PreviewButton/PreviewButton'
import PublishButton from './PublishButton/PublishButton'
import RetractButton from './RetractButton/RetractButton'
import ScorerSelect from './ScorerSelect'
import StatusSelect from './StatusSelect'
import UserSimulation from 'src/models/userSimulation'
import UserSimulationRepository from 'src/repos/v2/userSimulation'
import { WrappingFunction } from '@shopify/react-compose'
import _ from 'lodash'
import axios from 'axios'
import moment from 'moment'
import palette from 'src/theme/palette'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal },
      assessmentStore,
      userSimulationStore,
    } = useRootStore()

    const {
      scoringManagementMutate: mutate,
    }: { scoringManagementMutate: any } = props

    const columns: Array<AdminColumn> = [
      {
        Header: 'Due Date',
        width: 100,
        Cell: (cellProps: any) => {
          const startDate = new Date(cellProps.row.original.createdAt) as Date
          const deadline = cellProps.row.original.userSimulation
            .deadline as number
          const dueDate = new Date(
            new Date().setDate(startDate.getDate() + deadline)
          )

          return <Box>{moment(dueDate).format('MM-DD-YYYY')}</Box>
        },
      },
      {
        Header: 'Group Due Date',
        width: 100,
        Cell: (cellProps: any) => {
          const relatedAssessments = cellProps.row.original
            .relatedAssessments as (Assessment & {
            userSimulation: UserSimulation
          })[]
          const userBaseline = relatedAssessments?.find(
            (_assessment) =>
              _assessment.userSimulation.simulationType ===
              SimulationType.Baseline
          )?.userSimulation
          if (!userBaseline) return <Box />
          const notPassedDomains =
            userBaseline.results.scoreByMainDomain.filter(
              (_scoreByMainDomain) =>
                _scoreByMainDomain.allAnswersCount !== 0 &&
                !_scoreByMainDomain.pass
            )
          const startDate = new Date(cellProps.row.original.createdAt) as Date
          const deadline = cellProps.row.original.userSimulation
            .deadline as number
          const dueDate = new Date(
            new Date().setDate(startDate.getDate() + deadline)
          )
          if (notPassedDomains.length === 0) {
            return <Box>{moment(dueDate).format('MM-DD-YYYY')}</Box>
          } else if (notPassedDomains.length > relatedAssessments.length - 1) {
            return <Box>Pending</Box>
          }
          let lastDueDate = dueDate
          relatedAssessments.forEach((_relatedAssessment) => {
            const _startDate = new Date(_relatedAssessment.createdAt)
            const _deadline = _relatedAssessment.userSimulation.deadline
            const _dueDate = new Date(
              new Date().setDate(_startDate.getDate() + _deadline)
            )
            if (_dueDate > lastDueDate) {
              lastDueDate = _dueDate
            }
          })

          return <Box>{moment(lastDueDate).format('MM-DD-YYYY')}</Box>
        },
      },
      {
        Header: 'Simulation',
        accessor: 'userSimulation.simulation.name',
        type: Type.String,
        width: 100,
      },
      {
        Header: 'First Name',
        accessor: 'userSimulation.user.profile.firstName',
        type: Type.String,
        width: 100,
      },
      {
        Header: 'Last Name',
        accessor: 'userSimulation.user.profile.lastName',
        type: Type.String,
        width: 100,
      },
      {
        Header: 'Scorer-1',
        accessor: 'firstScorer._id',
        type: Type.String,
        width: 200,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <ScorerSelect {...cellProps} path="firstScorer._id" mutate={mutate} />
        ),
      },
      {
        Header: 'Scorer-1 Status',
        accessor: 'status',
        type: Type.String,
        width: 700,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => <StatusSelect {...cellProps} type="firstScorer" mutate={mutate} />,
      },
      {
        Header: 'Scorer-2',
        accessor: 'secondScorer._id',
        type: Type.String,
        width: 100,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <ScorerSelect
            {...cellProps}
            path="secondScorer._id"
            mutate={mutate}
          />
        ),
      },
      {
        Header: 'Scorer-2 Status',
        // accessor: 'secondScorerId',
        type: Type.String,
        width: 300,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <StatusSelect {...cellProps} type="secondScorer" mutate={mutate} />
        ),
      },
      {
        Header: 'Adjudicator',
        accessor: 'adjudicator',
        type: Type.String,
        width: 100,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => (
          <ScorerSelect {...cellProps} path="adjudicator._id" mutate={mutate} />
        ),
      },
      {
        Header: 'Adjudicator Status',
        // accessor: 'secondScorerId',
        type: Type.String,
        width: 300,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => <StatusSelect {...cellProps} type="adjudicator" mutate={mutate} />,
      },

      {
        Header: 'Retract',
        type: Type.String,
        width: 200,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => {
          const {
            row: { original: assessment },
          } = cellProps
          return (
            <RetractButton
              userSimulation={assessment.userSimulation}
              mutate={mutate}
            />
          )
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
