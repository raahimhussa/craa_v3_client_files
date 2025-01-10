import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Modal,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  AssessmentStatus,
  SimulationType,
  UserSimulationStatus,
} from 'src/utils/status'
import { observer, useLocalObservable } from 'mobx-react'

import Assessment from 'src/models/assessment'
import { CellProps } from 'react-table'
import ClientName from './columns/ClientName'
import DistributeDialog from './columns/DistributeDialog'
// import { EnhancedAssessment } from 'src/ui/pages/admin/Reporting/ReportingView'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import UserName from './columns/UserName'
import UserSimulation from 'src/models/userSimulation'
import UserTrainingRepository from 'src/repos/v2/userTrainingRepository'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const { enqueueSnackbar } = useSnackbar()
    const {
      uiState: { modal },
      assessmentStore,
      userSimulationStore,
    } = useRootStore()

    const columns: Array<AdminColumn> = [
      {
        Header: 'Client',
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const {
            row: { original },
          } = cellProps
          return <ClientName userSimulationId={original._id} />
        },
        minWidth: 150,
      },
      {
        Header: 'Name',
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const {
            row: { original },
          } = cellProps
          return <UserName userSimulationId={original._id} />
        },
        minWidth: 150,
      },
      {
        Header: 'Time Spent',
        cellType: CellType.Date,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const {
            row: { original },
          } = cellProps
          return <Box>{original.usageTime}</Box>
        },
        minWidth: 150,
      },
      {
        Header: 'Due Date',
        cellType: CellType.Date,
        minWidth: 150,
      },
      {
        Header: 'Pending Client Review',
        minWidth: 150,
        Cell: () => <Checkbox></Checkbox>,
      },
      {
        Header: 'Unusual Behavior',
        minWidth: 150,
        Cell: () => <Checkbox></Checkbox>,
      },
      {
        Header: 'Minimum Effort',
        minWidth: 150,
        Cell: () => <Checkbox></Checkbox>,
      },
      {
        Header: ' ',
        minWidth: 150,
        Cell: observer((cellProps: CellProps<UserSimulation>) => {
          const {
            row: { original: userSimulation },
          } = cellProps
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))

          const onClickReporting = () => {
            state.isOpen = true
          }

          const onClickClose = () => {
            state.isOpen = false
          }

          return (
            <>
              <Stack direction={'row'} spacing={1}>
                <Button variant="outlined" onClick={onClickReporting}>
                  UserCard
                </Button>
                {(userSimulation.status === UserSimulationStatus.Published ||
                  userSimulation.status ===
                    UserSimulationStatus.Distributed) && (
                  <DistributeDialog
                    disabled={
                      userSimulation.status === UserSimulationStatus.Distributed
                    }
                    userSimulation={userSimulation}
                    userSimulationStore={userSimulationStore}
                  />
                )}
                {userSimulation.simulationType === SimulationType.Baseline &&
                (userSimulation.status === UserSimulationStatus.Published ||
                  userSimulation.status ===
                    UserSimulationStatus.Distributed) ? (
                  <Button
                    disabled={
                      userSimulation.status === UserSimulationStatus.Distributed
                    }
                    variant="outlined"
                  >
                    Distribute All
                  </Button>
                ) : null}
              </Stack>
              <Modal open={state.isOpen}>
                <Box>
                  <AppBar position="static">
                    <Toolbar>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        Reporting
                      </Typography>
                      <Button onClick={onClickClose} color="inherit">
                        Close
                      </Button>
                    </Toolbar>
                  </AppBar>
                  <Reporting userId={cellProps.row.original.userId} />
                </Box>
              </Modal>
            </>
          )
        }),
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
