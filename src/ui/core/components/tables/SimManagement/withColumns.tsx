import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import { AppBar, Box, Button, Modal, Toolbar, Typography } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import BadgeIcon from '@mui/icons-material/Badge'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import DehazeIcon from '@mui/icons-material/Dehaze'
import Followups from './columns/Followups/Followups'
import Loadmap from 'src/ui/pages/admin/Loadmap/Loadmap'
import ReopenDialogue from '@components/ReopenDialogue/ReopenDialogue'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import ScreenRecords from '../ScreenRecords/ScreenRecords'
import Simulation from 'src/models/simulation'
import User from 'src/models/user'
import UserSimulation from 'src/models/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import moment from 'moment'
import palette from 'src/theme/palette'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal, simulations },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Follow Ups',
        cellType: CellType.SubComponent,
        renderRowSubComponent: ({ row }: any) => {
          return (
            <Followups
              buttons={false}
              userSimulations={row.original.userFollowups.filter(
                (_userFollowup: UserSimulation) =>
                  _userFollowup.status !== UserSimulationStatus.HasNotAssigned
              )}
              user={row.original.user}
              {...props}
            />
          )
        },
      },
      {
        Header: 'Client',
        accessor: 'clientUnit.name',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Last Name',
        accessor: 'user.profile.lastName',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'First Name',
        accessor: 'user.profile.firstName',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Simulation',
        accessor: 'assessmentType.baseline.label',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Allocated Time',
        accessor: 'assessmentType.baseline.testTime',
        minWidth: 200,
        type: Type.String,
        Cell: (cellProps: any) => {
          const userBaseline = cellProps.row.original
            .userBaseline as UserSimulation
          const testTime = userBaseline.testTime
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
        accessor: 'userBaseline.usageTime',
        minWidth: 200,
        type: Type.String,
        Cell: (cellProps: any) => {
          const userBaseline = cellProps.row.original
            .userBaseline as UserSimulation
          const usageTime = userBaseline.usageTime
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
        accessor: 'userBaseline.attemptCount',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Last Login',
        accessor: 'user.status.signinAt',
        minWidth: 200,
        type: Type.String,
        Cell: (cellProps: any) => {
          const date = cellProps.row.original.user?.status.signinAt as Date
          return (
            <Box>
              {date ? moment(date).format('DD-MMM-yyyy hh:mm:ss') : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Date Assigned',
        accessor: 'userBaseline.assignedAt',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: any) => {
          const userBaseline = cellProps.row.original
            .userBaseline as UserSimulation
          return (
            <Box>
              {userBaseline.assignedAt
                ? moment(userBaseline.assignedAt).format('DD-MMM-yyyy hh:mm:ss')
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Submit Date',
        accessor: 'userBaseline.submittedAt',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: any) => {
          const userBaseline = cellProps.row.original
            .userBaseline as UserSimulation
          return (
            <Box>
              {userBaseline.submittedAt
                ? moment(userBaseline.submittedAt).format(
                    'DD-MMM-yyyy hh:mm:ss'
                  )
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Publish Date',
        accessor: 'userBaseline.publishedAt',
        cellType: CellType.Date,
        minWidth: 200,
        Cell: (cellProps: any) => {
          const userBaseline = cellProps.row.original
            .userBaseline as UserSimulation
          return (
            <Box>
              {userBaseline.publishedAt
                ? moment(userBaseline.publishedAt).format(
                    'DD-MMM-yyyy hh:mm:ss'
                  )
                : '-'}
            </Box>
          )
        },
      },
      {
        Header: 'Sim Status',
        accessor: 'userBaseline.status',
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
        Header: 'Screen Logs',
        // accessor: 'status.logoutAt',
        type: Type.String,
        width: 150,
        Cell: observer((props: CellProps<any>) => {
          const onClickScreenLog = () => {
            modal.open(
              'S',
              <ScreenRecords
                userSimulationId={props.row.original.userBaseline._id}
                type={'baseline'}
              />
            )
          }
          return (
            <Button
              variant="outlined"
              onClick={onClickScreenLog}
              disabled={props.row.original.status == 'HasNotStarted'}
            >
              Screen Log
            </Button>
          )
        }),
      },
      {
        Header: ' ',
        type: Type.String,
        Cell: observer((cellProps: CellProps<any>) => {
          const {
            uiState: { modal },
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isUserCardOpen: false,
            isLoadMapOpen: false,
            isReOpen: false,
          }))
          const onClickReporting = () => {
            state.isUserCardOpen = true
            modal.payload = { user: cellProps.row.original }
          }

          const onClickReportingClose = () => {
            modal.payload = {}
            state.isUserCardOpen = false
          }
          const onClickLoadmap = () => {
            state.isLoadMapOpen = true
            modal.payload = { user: cellProps.row.original }
          }

          const onClickLoadmapClose = () => {
            modal.payload = {}
            state.isLoadMapOpen = false
          }

          //reopen
          const user = cellProps.row.original.user as User
          const userBaseline = cellProps.row.original
            .userBaseline as UserSimulation
          const simulation = cellProps.row.original.userBaseline
            .simulation as Simulation
          const simManagementMutate = props.simManagementMutate
          const countMutate = props.countMutate

          const onClickReopen = async (
            additionalTestTime: number,
            additionalAttemptCount: number
          ) => {
            await axios.post(
              `v3/simManagement/userSimulations/${userBaseline._id}/reopen`,
              {
                additionalTestTime,
                additionalAttemptCount,
              }
            )
            simManagementMutate && (await simManagementMutate())
            countMutate && (await countMutate())
          }

          const onClickReOpenModal = () => {
            state.isReOpen = true
          }

          const onHandleClose = () => {
            state.isReOpen = false
          }

          return (
            <Box>
              <Button
                variant="contained"
                onClick={onClickLoadmap}
                sx={{
                  // border: '1px solid rgb(84,91,100) !important',
                  // color: 'rgb(84,91,100) !important',
                  height: '28px',
                  mr: 0.5,
                  px: '0 !important',
                  minWidth: '30px !important',
                }}
              >
                <DehazeIcon />
              </Button>
              <Modal open={state.isLoadMapOpen}>
                <Box>
                  <AppBar position="static">
                    <Toolbar>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        Data Visualization
                      </Typography>
                      <Button onClick={onClickLoadmapClose} color="inherit">
                        Close
                      </Button>
                    </Toolbar>
                  </AppBar>
                  <Loadmap
                    userSimulation={cellProps.row.original.userBaseline}
                    user={cellProps.row.original.user}
                  />
                </Box>
              </Modal>
              <Button
                variant="contained"
                onClick={onClickReporting}
                sx={{
                  // border: '1px solid rgb(84,91,100) !important',
                  // color: 'rgb(84,91,100) !important',
                  height: '28px',
                  px: '0 !important',
                  minWidth: '30px !important',
                  bgcolor: palette.light.button.green,
                  mr: 0.5,
                }}
              >
                <BadgeIcon />
              </Button>
              <Modal open={state.isUserCardOpen}>
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
                      <Button onClick={onClickReportingClose} color="inherit">
                        Close
                      </Button>
                    </Toolbar>
                  </AppBar>
                  <Reporting
                    userId={cellProps.row.original.user?._id.toString()}
                  />
                </Box>
              </Modal>
              <Button
                variant="contained"
                onClick={onClickReOpenModal}
                sx={{
                  // border: '1px solid rgb(84,91,100) !important',
                  // color: 'rgb(84,91,100) !important',
                  height: '28px',
                  px: '0 !important',
                  bgcolor: palette.light.button.yellow,
                  fontWeight: 600,
                  fontSize: '13px',
                  mr: 1,
                }}
              >
                Reopen
              </Button>
              <ReopenDialogue
                open={state.isReOpen}
                handleClose={onHandleClose}
                onReopen={onClickReopen}
                title={`Are you sure you want to reopen this ${userBaseline?.simulationType} simulation?
                (${simulation?.label} - ${user?.name})`}
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
      // {
      //   Header: 'Reopen',
      //   type: Type.String,
      //   Cell: observer((cellProps: CellProps<any>) => {
      //     const state = useLocalObservable(() => ({
      //       isOpen: false,
      //     }))
      //     const user = cellProps.row.original.user as User
      //     const userBaseline = cellProps.row.original
      //       .userBaseline as UserSimulation
      //     const simulation = cellProps.row.original.userBaseline
      //       .simulation as Simulation
      //     const simManagementMutate = props.simManagementMutate
      //     const countMutate = props.countMutate

      //     const onClickReopen = async (
      //       additionalTestTime: number,
      //       additionalAttemptCount: number
      //     ) => {
      //       await axios.post(
      //         `v3/simManagement/userSimulations/${userBaseline._id}/reopen`,
      //         {
      //           additionalTestTime,
      //           additionalAttemptCount,
      //         }
      //       )
      //       simManagementMutate && (await simManagementMutate())
      //       countMutate && (await countMutate())
      //     }

      //     const onClickOpen = () => {
      //       state.isOpen = true
      //     }

      //     const onHandleClose = () => {
      //       state.isOpen = false
      //     }

      //     return (
      //       <Box>
      //         <Button
      //           variant="contained"
      //           onClick={onClickOpen}
      //           sx={{
      //             // border: '1px solid rgb(84,91,100) !important',
      //             // color: 'rgb(84,91,100) !important',
      //             height: '28px',
      //             px: '0 !important',
      //             bgcolor: palette.light.button.yellow,
      //             fontWeight: 600,
      //             fontSize: '13px',
      //           }}
      //         >
      //           Reopen
      //         </Button>
      //         <ReopenDialogue
      //           open={state.isOpen}
      //           handleClose={onHandleClose}
      //           onReopen={onClickReopen}
      //           title={`Are you sure you want to reopen this ${userBaseline?.simulationType} simulation?
      //           (${simulation?.label} - ${user?.name})`}
      //           text={
      //             "This simulation will be reopened immediately. You can't undo this action."
      //           }
      //           yesText={'Reopen'}
      //           noText={'Cancel'}
      //         />
      //       </Box>
      //     )
      //   }),
      // },
      // {
      //   Header: 'Actions',
      //   minWidth: 200,
      //   Cell: CellButtons,
      //   edit: () => {
      //     modal.open('Simulation', <Simulation />)
      //   },
      // },
    ]

    const meta = {
      columns,
    }
    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
