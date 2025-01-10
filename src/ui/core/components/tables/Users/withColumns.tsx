import { AdminColumn, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { AppBar, Box, Button, Modal, Toolbar, Typography } from '@mui/material'
import compose, { WrappingFunction } from '@shopify/react-compose'
import { observer, useLocalObservable } from 'mobx-react'

import CellButtons from '@components/cells/CellButtons/CellButtons'
import CellDetailButton from '@components/cells/CellDetailButton/CellDetailButton'
import { CellProps } from 'react-table'
import EditUser from '@components/forms/EditUser/EditUser'
import Reporting from 'src/ui/pages/admin/Reporting/Reporting'
import User from 'src/models/user'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal },
    } = useRootStore()

    const columns: Array<AdminColumn> = [
      {
        Header: 'LastName',
        accessor: 'profile.firstName',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'FirstName',
        accessor: 'profile.lastName',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Email',
        accessor: 'email',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Country',
        accessor: 'country.name',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Initial',
        accessor: 'profile.initial',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Username',
        accessor: 'name',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Client',
        accessor: 'client.name',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Manager',
        accessor: 'profile.authCode',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Role',
        accessor: 'role.title',
        type: Type.String,
        width: 50,
      },
      {
        Header: 'Account Created Date',
        accessor: 'createdAt',
        type: Type.String,
        width: 50,
      },
      {
        Header: 'Email Verification Date',
        accessor: 'emailVerification',
        type: Type.String,
        width: 150,
      },
      {
        Header: 'Status',
        accessor: 'profile.status',
        type: Type.String,
        width: 150,
        Cell: (props: any) => {
          return props.row.original.isActivated ? 'Active' : 'Inactive'
        },
      },
      // {
      //   Header: 'Online',
      //   accessor: 'status.online',
      //   type: Type.String,
      //   width: 150,
      //   Cell: (cellProps: any) => {
      //     return (
      //       <div>
      //         {cellProps.row.original.status?.online ? 'true' : 'false'}
      //       </div>
      //     )
      //   },
      // },
      {
        Header: 'Reporting',
        type: Type.String,
        Cell: observer((cellProps: CellProps<User>) => {
          const {
            uiState: { modal },
            authStore,
          } = useRootStore()
          const state = useLocalObservable(() => ({
            isOpen: false,
          }))
          const onClickReporting = () => {
            state.isOpen = true
            modal.payload = { user: cellProps.row.original }
          }

          const onClickClose = () => {
            modal.payload = {}
            state.isOpen = false
          }
          if (authStore.isPfizerAdmin) {
            return (
              <Box>
                <Button
                  variant="outlined"
                  onClick={onClickReporting}
                  sx={{
                    border: '1px solid rgb(84,91,100) !important',
                    color: 'rgb(84,91,100) !important',
                    height: '28px',
                  }}
                >
                  UserCard
                </Button>
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
                    <Reporting userId={cellProps.row.original._id.toString()} />
                  </Box>
                </Modal>
              </Box>
            )
          } else {
            return <></>
          }
        }),
      },
      {
        Header: 'actions',
        storeKey: 'userStore',
        Cell: CellButtons,
        minWidth: 150,
        mutateKey: 'users',
        edit: (cellProps: any) => {
          modal.open('Users', <EditUser usersMutate={props.usersMutate} />)
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns

const UserReportingCardView = observer(
  (cellProps: CellProps<any> & { userId: string }) => {
    const state = useLocalObservable(() => ({
      isOpen: false,
    }))
    const onClcikReporting = () => {
      state.isOpen = true
    }

    const onClickClose = () => {
      state.isOpen = false
    }

    return (
      <>
        <Button variant="outlined" onClick={onClcikReporting}>
          UserCard
        </Button>
        <Modal open={state.isOpen}>
          <Box>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Reporting
                </Typography>
                <Button onClick={onClickClose} color="inherit">
                  Close
                </Button>
              </Toolbar>
            </AppBar>
            <Reporting userId={cellProps.row.original._id} />
          </Box>
        </Modal>
      </>
    )
  }
)

export const UserReportingCard = compose<any>()(UserReportingCardView)
