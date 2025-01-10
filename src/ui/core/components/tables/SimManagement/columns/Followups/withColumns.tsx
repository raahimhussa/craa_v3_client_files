import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { Box, Button } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import ReopenDialogue from '@components/ReopenDialogue/ReopenDialogue'
import ScreenRecords from '@components/tables/ScreenRecords/ScreenRecords'
import Simulation from 'src/models/simulation'
import User from 'src/models/user'
import UserSimulation from 'src/models/userSimulation'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import moment from 'moment'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal, simulations },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Simulation',
        accessor: 'simulation.name',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Allocated Time',
        accessor: 'testTime',
        minWidth: 200,
        type: Type.String,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          const testTime = userFollowup.testTime
          if (!testTime) return '-'
          const hours = Math.floor(testTime / (60 * 60))
          const mins = Math.floor((testTime - hours * 60 * 60) / 60)
          const secs = testTime - hours * 60 * 60 - mins * 60

          return `${hours.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        },
      },
      {
        Header: 'Time Spent',
        accessor: 'usageTime',
        minWidth: 200,
        type: Type.String,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          const usageTime = userFollowup.usageTime
          if (!usageTime) return '-'
          const hours = Math.floor(usageTime / (60 * 60))
          const mins = Math.floor((usageTime - hours * 60 * 60) / 60)
          const secs = usageTime - hours * 60 * 60 - mins * 60

          return `${hours.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        },
      },
      {
        Header: 'Attempt Count',
        accessor: 'attemptCount',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Date Assigned',
        accessor: 'assignedAt',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          return (
            <Box>
              {userFollowup.assignedAt
                ? moment(userFollowup.assignedAt).format('DD-MMM-yyyy hh:mm:ss')
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Submit Date',
        accessor: '',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          return (
            <Box>
              {userFollowup.submittedAt
                ? moment(userFollowup.submittedAt).format(
                    'DD-MMM-yyyy hh:mm:ss'
                  )
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Publish Date',
        accessor: 'updatedAt',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: CellProps<UserSimulation>) => {
          const userFollowup = cellProps.row.original
          return (
            <Box>
              {userFollowup.publishedAt
                ? moment(userFollowup.publishedAt).format(
                    'DD-MMM-yyyy hh:mm:ss'
                  )
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Sim Stauts',
        accessor: 'status',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Result Stage',
        accessor: '',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Reopen',
        type: Type.String,
        Cell: observer((cellProps: CellProps<any>) => {
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))
          const user = props.user as User
          const userFollowup = cellProps.row.original as UserSimulation
          const simulation = cellProps.row.original.simulation as Simulation
          const simManagementMutate = props.simManagementMutate
          const countMutate = props.countMutate

          const onClickReopen = async () => {
            await axios.post(
              `v3/simManagement/userSimulations/${userFollowup._id}/reopen`
            )
            simManagementMutate && (await simManagementMutate())
            countMutate && (await countMutate())
          }

          const onClickOpen = () => {
            state.isOpen = true
          }

          const onHandleClose = () => {
            state.isOpen = false
          }

          return (
            <Box>
              <Button
                variant="outlined"
                onClick={onClickOpen}
                sx={{
                  border: '1px solid rgb(84,91,100) !important',
                  color: 'rgb(84,91,100) !important',
                  height: '28px',
                }}
              >
                Reopen
              </Button>
              <ReopenDialogue
                open={state.isOpen}
                handleClose={onHandleClose}
                onReopen={onClickReopen}
                title={`Are you sure you want to reopen this ${userFollowup.simulationType} simulation?
                (${simulation.label} - ${user.name})`}
                text={
                  "This simulation will be reopened immediately. You can't undo this action."
                }
                yesText={'Reopen'}
                noText={'Cancel'}
              />
            </Box>
          )
        }),
      },
      {
        Header: 'Action',
        // accessor: 'status.logoutAt',
        type: Type.String,
        width: 150,
        Cell: observer((props: CellProps<any>) => {
          const onClickScreenLog = () => {
            modal.open(
              'S',
              <ScreenRecords userSimulationId={props.row.original._id} />
            )
          }

          return (
            <Button
              variant="outlined"
              onClick={onClickScreenLog}
              disabled={props.row.original.status == 'hasNotAssigned'}
            >
              Screen Log
            </Button>
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
