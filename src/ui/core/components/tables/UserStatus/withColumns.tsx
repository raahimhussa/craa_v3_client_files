import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'
import {
  DatePicker,
  DesktopDatePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { JSXElementConstructor, ReactElement, useState } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import dayjs, { Dayjs } from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import Logs from 'src/ui/pages/admin/SimManagement/LogsPage/Logs'
import Switch from '@mui/material/Switch'
import UserAssessmentCycle from 'src/models/userAssessmentCycle'
import UserSimulation from 'src/models/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import axios from 'axios'
import { highlightedText } from 'src/utils/highlightedText'
import moment from 'moment'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

const withColumns = (WrappedComponent: any) =>
  observer((props: any) => {
    const {
      // @ts-ignore
      uiState: { modal, userStatus },
      authStore,
    } = useRootStore()
    const { enqueueSnackbar } = useSnackbar()

    console.log({ props })

    const mutate = () => {
      props.userStatusManagementMutate && props.userStatusManagementMutate()
      props.countMutate && props.countMutate()
    }
    //@ts-ignore
    const columns: AdminColumn[] = !authStore.user?.authority?.pfizerAdmin
      ? [
          {
            Header: 'Email',
            accessor: 'user.email',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'Last Name',
            accessor: 'user.profile.lastName',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'First Name',
            accessor: 'user.profile.firstName',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'Vendor',
            accessor: 'clientUnit.name',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
            // Cell: (cellProps: CellProps<any>) => {
            //   const clientUnitName = cellProps?.row?.original?.clientUnit?.name
            //   return <Box>{clientUnitName ? clientUnitName : '-'}</Box>
            // },
          },
          {
            Header: 'Status',
            accessor: 'status',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'Simulation Process Completed',
            headerClassName: 'w-36 h-12 whitespace-normal lineHeight-18',
            Cell: (cellProps: CellProps<any>) => {
              //FIXME - generate simulationProcessCompleted
              const simulationProcessCompleted =
                cellProps.row.original.userFollowups
                  .filter(
                    (_userFollowup: any) =>
                      _userFollowup.status !==
                      UserSimulationStatus.HasNotAssigned
                  )
                  .reduce((acc: Date | undefined, cur: any) => {
                    if (acc === undefined) return cur.publishedAt
                    if (cur.publishedAt > acc) return cur.publishedAt
                    return acc
                  }, undefined)

              return (
                <Box>
                  {simulationProcessCompleted
                    ? moment(simulationProcessCompleted).format('DD-MMM-YYYY')
                    : '-'}
                </Box>
              )
            },
          },
          {
            Header: 'Result',
            accessor: 'grade',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'Verified',
            accessor: 'verified',
            Cell: (cellProps: CellProps<UserAssessmentCycle>) => {
              const onChange = async (e: any) => {
                try {
                  await axios.patch('/v1/userAssessmentCycles', {
                    filter: {
                      _id: cellProps.row.original._id,
                    },
                    update: {
                      $set: {
                        verified: e.target.checked,
                      },
                    },
                  })
                  mutate()
                  enqueueSnackbar('verified has changed!', {
                    variant: 'success',
                  })
                } catch (e) {
                  console.error(e)
                  enqueueSnackbar('change verified failed', {
                    variant: 'error',
                  })
                }
              }
              return (
                <Switch
                  checked={cellProps.row.original.verified}
                  onChange={onChange}
                />
              )
            },
          },
          {
            Header: 'Sign Off',
            accessor: 'signedOff',
            Cell: (cellProps: CellProps<UserAssessmentCycle>) => {
              const [value, setValue] = useState<Dayjs | null>(
                cellProps.row.original.signedOffDate
                  ? dayjs(cellProps.row.original.signedOffDate)
                  : null
              )
              const handleChange = (newValue: Dayjs | null) => {
                setValue(newValue)
              }
              const onChange = async (e: any) => {
                try {
                  await axios.patch('/v1/userAssessmentCycles', {
                    filter: {
                      _id: cellProps.row.original._id,
                    },
                    update: {
                      $set: {
                        signedOff: e.target.checked,
                      },
                    },
                  })
                  mutate()
                  enqueueSnackbar('sign off has changed!', {
                    variant: 'success',
                  })
                } catch (e) {
                  console.error(e)
                  enqueueSnackbar('change sign off failed', {
                    variant: 'error',
                  })
                }
              }

              const onClickSave = async (v: any) => {
                try {
                  await axios.patch('/v1/userAssessmentCycles', {
                    filter: {
                      _id: cellProps.row.original._id,
                    },
                    update: {
                      $set: {
                        signedOffDate: v ? v.toDate() : v,
                      },
                    },
                  })
                  enqueueSnackbar('sign off date has changed!', {
                    variant: 'success',
                  })
                } catch (e) {
                  enqueueSnackbar('change sign off date failed', {
                    variant: 'error',
                  })
                  console.error(e)
                }
                mutate()
              }
              return (
                <div
                  style={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Switch
                    checked={cellProps.row.original.signedOff}
                    onChange={onChange}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mr: 1,
                    }}
                  >
                    {/* @ts-ignore */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        inputFormat="MM/DD/YYYY"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              sx={{
                                width: '140px',
                                '& input': {
                                  fontSize: '13px!important',
                                },
                              }}
                              size="small"
                            />
                          )
                        }}
                      />{' '}
                    </LocalizationProvider>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      sx={{ mr: 1 }}
                      variant="contained"
                      size="small"
                      onClick={() => onClickSave(value)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onClickSave(null)}
                    >
                      Reset
                    </Button>
                  </Box>
                </div>
              )
            },
          },
          {
            Header: 'Baseline Scored',
            accessor: 'userBaseline.publishedAt',
            Cell: (cellProps: CellProps<any>) => {
              const publishedAt =
                cellProps?.row?.original?.userBaseline?.publishedAt
              return (
                <Box>
                  {publishedAt
                    ? moment(publishedAt).format('DD-MMM-YYYY')
                    : '-'}
                </Box>
              )
            },
          },
          {
            Header: 'Invoiced',
            accessor: 'userBaseline.invoiced',
            Cell: (cellProps: CellProps<any>) => {
              const invoiced = cellProps?.row?.original?.invoiced
              const invoicedDate = cellProps?.row?.original?.invoicedDate
              return (
                <Box>
                  {invoiced ? moment(invoicedDate).format('MMM-YYYY') : '-'}
                </Box>
              )
            },
          },
          {
            Header: 'Minimum Effort',
            accessor: 'minimumEffort',
            Cell: (cellProps: CellProps<any>) => {
              const onChange = async (e: any) => {
                mutate()
              }
              return <Switch checked={cellProps.value} onChange={onChange} />
            },
          },
          {
            Header: 'Unusual Behavior',
            accessor: 'collaborated',
            Cell: (cellProps: CellProps<any>) => {
              const onChange = async (e: any) => {
                mutate()
              }
              return <Switch checked={cellProps.value} onChange={onChange} />
            },
          },
          {
            Header: 'Email Alias',
            accessor: '',
            type: Type.String,
            Cell: (cellProps: any) => {
              const [aliasEmailsString, setAliasEmailsString] =
                useState<string>(
                  cellProps.row.original?.user?.aliasEmails
                    ? cellProps.row.original?.user?.aliasEmails.join(',')
                    : ''
                )

              const onChange = async (e: any) => {
                setAliasEmailsString(e.target.value)
              }

              const onClickSave = async (v: any) => {
                try {
                  await axios.patch('/v1/users', {
                    filter: {
                      _id: cellProps.row.original?.user?._id,
                    },
                    update: {
                      $set: {
                        aliasEmails: aliasEmailsString.split(',' || ';'),
                      },
                    },
                  })
                  mutate()
                  enqueueSnackbar('email alias has changed!', {
                    variant: 'success',
                  })
                } catch (e) {
                  enqueueSnackbar('change email alias failed', {
                    variant: 'error',
                  })
                  console.error(e)
                }
                props.userAssessmentCyclesMutate &&
                  (await props.userAssessmentCyclesMutate())
              }

              return (
                <div
                  style={{
                    display: 'flex',
                    alignContent: 'center',
                    width: '250px',
                  }}
                >
                  <TextField
                    size="small"
                    id="outlined-basic"
                    variant="outlined"
                    value={aliasEmailsString}
                    onChange={onChange}
                    sx={{
                      width: '200px',
                      mr: 1,
                      height: '29px !important',
                      lineHeight: 0,
                      '& input': {
                        height: '29px !important',
                        fontSize: '13px!important',
                        padding: '0px 8px',
                      },
                    }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={onClickSave}
                  >
                    save
                  </Button>
                </div>
              )
            },
          },
          {
            Header: 'Actions',
            minWidth: 200,
            type: Type.String,
            // @ts-ignore
            storeKey: 'userStatusStore',
            // @ts-ignore
            mutateKey: 'userStatus',
            Cell: CellButtons,
          },
          // {
          //   Header: 'Followup Logs',
          //   cellType: CellType.SubComponent,
          //   renderRowSubComponent: (cellProps: CellProps<any>) => (
          //     <Logs userId={cellProps.row.original.userId} />
          //   ),
          // },
          // {
          //   Header: 'ScreenRecorder',
          //   Cell: (cellProps: any) => {
          //     const { dialogStore } = useRootStore()
          //     const onClick = () => {
          //       dialogStore.dialog.isVisible = true
          //       dialogStore.dialog.title = 'ScreenRecorder'
          //       dialogStore.dialog.content = (
          //         <ScreenRecorders
          //           userSimulationId={cellProps.row.original.userSimulationId}
          //         />
          //       )
          //     }
          //     return (
          //       <IconButton onClick={onClick}>
          //         <Videocam />
          //       </IconButton>
          //     )
          //   },
          //   minWidth: 300,
          // },
        ]
      : [
          {
            Header: 'Email',
            accessor: 'user.email',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'Last Name',
            accessor: 'user.profile.lastName',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'First Name',
            accessor: 'user.profile.firstName',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'Vendor',
            accessor: 'clientUnit.name',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
            // Cell: (cellProps: CellProps<any>) => {
            //   const clientUnitName = cellProps?.row?.original?.clientUnit?.name
            //   return <Box>{clientUnitName ? clientUnitName : '-'}</Box>
            // },
          },
          {
            Header: 'Status',
            accessor: 'status',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'Simulation Process Completed',
            headerClassName: 'w-36 h-12 whitespace-normal lineHeight-18',
            Cell: (cellProps: CellProps<any>) => {
              //FIXME - generate simulationProcessCompleted
              const simulationProcessCompleted =
                cellProps.row.original.userFollowups
                  .filter(
                    (_userFollowup: any) =>
                      _userFollowup.status !==
                      UserSimulationStatus.HasNotAssigned
                  )
                  .reduce((acc: Date | undefined, cur: any) => {
                    if (acc === undefined) return cur.publishedAt
                    if (cur.publishedAt > acc) return cur.publishedAt
                    return acc
                  }, undefined)

              return (
                <Box>
                  {simulationProcessCompleted
                    ? moment(simulationProcessCompleted).format('DD-MMM-YYYY')
                    : '-'}
                </Box>
              )
            },
          },
          {
            Header: 'Result',
            accessor: 'grade',
            type: Type.String,
            Cell: (cellProps: CellProps<any>) => {
              return highlightedText(cellProps.value, props.searchString)
            },
          },
          {
            Header: 'Sign Off',
            accessor: 'signedOff',
            Cell: (cellProps: CellProps<UserAssessmentCycle>) => {
              const [value, setValue] = useState<Dayjs | null>(
                cellProps.row.original.signedOffDate
                  ? dayjs(cellProps.row.original.signedOffDate)
                  : null
              )
              const handleChange = (newValue: Dayjs | null) => {
                setValue(newValue)
              }
              const onChange = async (e: any) => {
                try {
                  await axios.patch('/v1/userAssessmentCycles', {
                    filter: {
                      _id: cellProps.row.original._id,
                    },
                    update: {
                      $set: {
                        signedOff: e.target.checked,
                      },
                    },
                  })
                  mutate()
                  enqueueSnackbar('sign off has changed!', {
                    variant: 'success',
                  })
                } catch (e) {
                  console.error(e)
                  enqueueSnackbar('change sign off failed', {
                    variant: 'error',
                  })
                }
              }

              const onClickSave = async (v: any) => {
                try {
                  await axios.patch('/v1/userAssessmentCycles', {
                    filter: {
                      _id: cellProps.row.original._id,
                    },
                    update: {
                      $set: {
                        signedOffDate: v ? v.toDate() : v,
                      },
                    },
                  })
                  enqueueSnackbar('sign off date has changed!', {
                    variant: 'success',
                  })
                } catch (e) {
                  enqueueSnackbar('change sign off date failed', {
                    variant: 'error',
                  })
                  console.error(e)
                }
                mutate()
              }
              return (
                <div
                  style={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Switch
                    checked={cellProps.row.original.signedOff}
                    onChange={onChange}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mr: 1,
                    }}
                  >
                    {/* @ts-ignore */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        inputFormat="MM/DD/YYYY"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => {
                          return (
                            <TextField
                              {...params}
                              sx={{
                                width: '140px',
                                '& input': {
                                  fontSize: '13px!important',
                                },
                              }}
                              size="small"
                            />
                          )
                        }}
                      />{' '}
                    </LocalizationProvider>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      sx={{ mr: 1 }}
                      variant="contained"
                      size="small"
                      onClick={() => onClickSave(value)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onClickSave(null)}
                    >
                      Reset
                    </Button>
                  </Box>
                </div>
              )
            },
          },
          {
            Header: 'Minimum Effort',
            accessor: 'minimumEffort',
            Cell: (cellProps: CellProps<any>) => {
              const onChange = async (e: any) => {
                mutate()
              }
              return <Switch checked={cellProps.value} onChange={onChange} />
            },
          },
          {
            Header: 'Unusual Behavior',
            accessor: 'collaborated',
            Cell: (cellProps: CellProps<any>) => {
              const onChange = async (e: any) => {
                mutate()
              }
              return <Switch checked={cellProps.value} onChange={onChange} />
            },
          },
          {
            Header: 'Actions',
            minWidth: 200,
            type: Type.String,
            // @ts-ignore
            storeKey: 'userStatusStore',
            // @ts-ignore
            mutateKey: 'userStatus',
            Cell: CellButtons,
          },
          // {
          //   Header: 'Followup Logs',
          //   cellType: CellType.SubComponent,
          //   renderRowSubComponent: (cellProps: CellProps<any>) => (
          //     <Logs userId={cellProps.row.original.userId} />
          //   ),
          // },
          // {
          //   Header: 'ScreenRecorder',
          //   Cell: (cellProps: any) => {
          //     const { dialogStore } = useRootStore()
          //     const onClick = () => {
          //       dialogStore.dialog.isVisible = true
          //       dialogStore.dialog.title = 'ScreenRecorder'
          //       dialogStore.dialog.content = (
          //         <ScreenRecorders
          //           userSimulationId={cellProps.row.original.userSimulationId}
          //         />
          //       )
          //     }
          //     return (
          //       <IconButton onClick={onClick}>
          //         <Videocam />
          //       </IconButton>
          //     )
          //   },
          //   minWidth: 300,
          // },
        ]

    const meta = {
      columns,
    }
    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
