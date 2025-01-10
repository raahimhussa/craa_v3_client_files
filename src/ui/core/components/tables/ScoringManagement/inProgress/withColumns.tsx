import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { AppBar, IconButton, Modal, Toolbar } from '@mui/material'
import { AssessmentStatus, UserSimulationStatus } from 'src/utils/status'
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
      //FIXME - businessCycle에서 불러와야함, 아직 연결 안됨, 백엔드에서 호출해야해서 현재는 공백
      {
        Header: 'Due Date',
        // accessor:
        //   'userAssessmentCycle.sale?.services[0]?.gradingExpirationDate',
        type: Type.Date,
        cellType: CellType.Date,
        width: 100,
      },
      //FIXME - businessCycle에서 불러와야함, 아직 연결 안됨, 백엔드에서 호출해야해서 현재는 공백
      {
        Header: 'Group Due Date',
        // accessor: 'userAssessmentCycle.sale?.services[0]?.gradingExpirationDate',
        type: Type.Date,
        cellType: CellType.Date,
        width: 100,
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
        Header: 'Publish',
        type: Type.String,
        width: 200,
        Cell: (
          cellProps: CellProps<Assessment & { userSimulation: UserSimulation }>
        ) => {
          const {
            row: { original: assessment },
          } = cellProps
          return (
            <PublishButton
              assessment={assessment}
              userSimulation={assessment.userSimulation}
              mutate={mutate}
            />
          )
        },
      },
      {
        Header: 'Preview',
        type: Type.String,
        width: 200,
        Cell: observer(
          (
            cellProps: CellProps<
              Assessment & { userSimulation: UserSimulation }
            >
          ) => {
            const {
              row: { original: assessment },
            } = cellProps
            return (
              <PreviewButton
                assessment={assessment}
                userSimulation={assessment.userSimulation}
                mutate={mutate}
              />
            )
          }
        ),
      },
      {
        Header: 'Expedited',
        accessor: 'isExpdited',
        type: Type.String,
        minWidth: 400,
        Cell: (cellProps: any) => {
          return (
            <Box sx={{ width: '130px' }}>
              {true ? (
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: palette.light.button.blue,
                    width: '100px',
                  }}
                >
                  Expedited
                </Button>
              ) : (
                <Box>
                  <Circle htmlColor="green" />
                </Box>
              )}
            </Box>
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
