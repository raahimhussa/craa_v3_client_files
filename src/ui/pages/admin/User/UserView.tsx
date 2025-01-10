import { Authority, ClientUnitAuthority } from 'src/models/user/types'
import { Autocomplete, Select, TextField } from 'src/ui/core/components'
import {
  Button,
  ButtonBase,
  ButtonGroup,
  Grid,
  InputLabel,
  Paper,
  Typography,
} from '@mui/material'
import { Clear, Delete } from '@mui/icons-material'
import { green, red } from '@mui/material/colors'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import { IClientUnit } from 'src/models/clientUnit/clientUnit.interface'
import IRole from 'src/models/role/role.interface'
import Stack from '@mui/material/Stack'
import User from 'src/models/user'
import axios from 'axios'
import { useRootStore } from 'src/stores'

function UserView(props: {
  roles: IRole[]
  clientUnits: IClientUnit[]
  countries: any[]
}) {
  const {
    userStore,
    uiState: { users, alert, modal },
  } = useRootStore()

  useEffect(() => {
    userStore.users = []
    userStore.addUser()
  }, [])

  const onClickCancel = async () => {
    modal.close()
  }
  const onClickSave = async () => {
    modal.close()
    try {
      await Promise.all(userStore.users.map((user) => user.save()))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return alert.error(error.response?.data.errors[0]?.detail)
      }
    }
    userStore.users = []
    alert.success()
    users.mutate && users.mutate()
  }
  return (
    <Box sx={{ bgcolor: 'white' }}>
      <Box
        sx={{
          p: 1,
          color: 'white',
          display: 'flex',
          bgcolor: '#193433',
        }}
      >
        <Typography lineHeight={2} variant="h5">
          New User
        </Typography>
        <ButtonGroup
          sx={{
            display: 'flex',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button
            color="error"
            size="small"
            sx={{
              width: 80,
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: 'rgb(255,255,255,0.1) !important',
              },
            }}
            variant="contained"
            onClick={onClickCancel}
          >
            {/* <Close /> */}
            Cancel
          </Button>
          <Button
            size="small"
            sx={{ width: 80 }}
            variant="contained"
            color="primary"
            onClick={onClickSave}
          >
            {/* <Save /> */}
            Save
          </Button>
        </ButtonGroup>
      </Box>
      {/* <Box
        sx={{
          p: 2,
          height: 48,
          // background: (theme) => theme.craa?.palette.mainGradiant,
          display: 'flex',
          justifyContent: 'space-between',
          flex: 1,
          alignItems: 'center',
        }}
      >
        <Box sx={{ fontWeight: 600, fontSize: 20, color: 'white' }}>
          New User
        </Box>
      </Box> */}
      <Stack spacing={2} sx={{ p: 4, pb: 2, bgcolor: 'rgb(242, 243, 243)' }}>
        {/* <Button onClick={() => userStore.addUser()} variant="outlined">
          New User
        </Button> */}
        <Users {...props} />
      </Stack>
    </Box>
  )
}

const Users = observer(
  (props: { roles: IRole[]; clientUnits: IClientUnit[]; countries: any[] }) => {
    const { userStore } = useRootStore()

    const state = useLocalObservable<{
      authority: Authority
      clientUnitAuthority: ClientUnitAuthority
    }>(() => ({
      authority: {
        authorizedAll: false,
        whitelist: [],
      },
      clientUnitAuthority: {
        clientId: '',
        businessUnits: [],
      },
    }))

    reaction(
      () => state.clientUnitAuthority.clientId,
      () => {
        state.clientUnitAuthority.businessUnits = []
      }
    )

    const roleOptions = props.roles
      .map((role) => ({
        text: role.title,
        value: role._id,
      }))
      .filter(
        (_role) => _role.text !== 'SuperAdmin' && _role.text !== 'SimUser'
      )

    const clientsOptions = props.clientUnits.map((clientUnit) => ({
      text: clientUnit.name,
      value: clientUnit._id,
    }))

    const countryOptions = props.countries.map((c: any) => ({
      text: c.name,
      value: c._id,
    }))
    const renderUser = (user: User) => {
      const businessUnitOptions =
        props.clientUnits
          .find(
            (clientUnit) =>
              clientUnit._id === toJS(state.clientUnitAuthority.clientId)
          )
          ?.businessUnits.map((businessUnit) => ({
            text: businessUnit.name,
            value: businessUnit._id,
          })) || []

      const onClickAddAuthority = () => {
        if (
          !state.clientUnitAuthority.clientId ||
          state.clientUnitAuthority.businessUnits.length === 0
        ) {
          return
        }
        const whitelist = state.authority.whitelist
        if (
          whitelist.find(
            (_whitelistItem) =>
              _whitelistItem.clientId === state.clientUnitAuthority.clientId
          )
        ) {
          whitelist.forEach((_whitelistItem) => {
            if (_whitelistItem.clientId === state.clientUnitAuthority.clientId)
              _whitelistItem.businessUnits =
                state.clientUnitAuthority.businessUnits
          })
        } else {
          whitelist.push(toJS(state.clientUnitAuthority))
        }
        user.authority = toJS(state.authority)
      }

      return (
        <Grid container>
          {/* <Paper sx={{ p: 1 }}> */}
          {/* <Grid item container xs={12}> */}
          <Grid item xs={3} sx={{ mr: 2.5 }} className="paper-grid">
            <InputLabel sx={{ mb: 2 }}>User Information</InputLabel>
            <Stack spacing={1}>
              <InputLabel>User Name</InputLabel>
              <TextField
                disabled={true}
                state={user}
                path="name"
                variant="outlined"
                size="small"
              />
              <InputLabel>Email</InputLabel>
              <TextField
                state={user}
                path="email"
                variant="outlined"
                size="small"
                placeholder="Email"
              />
              <InputLabel>Password</InputLabel>
              <TextField
                state={user}
                path="password"
                variant="outlined"
                size="small"
                placeholder="Password"
              />
              <InputLabel>First Name</InputLabel>
              <TextField
                state={user}
                path="profile.firstName"
                variant="outlined"
                size="small"
                placeholder="First Name"
              />
              <InputLabel>Last Name</InputLabel>
              <TextField
                state={user}
                path="profile.lastName"
                variant="outlined"
                size="small"
                placeholder="Last Name"
              />
              <InputLabel>Role</InputLabel>
              <Select options={roleOptions} path="roleId" state={user} />
              <InputLabel>Country</InputLabel>
              <Select
                options={countryOptions}
                path="profile.countryId"
                state={user}
              />
            </Stack>
          </Grid>
          <Grid item xs={3} sx={{ mr: 2.5 }} className="paper-grid">
            <InputLabel sx={{ mb: 2 }}>Authorization</InputLabel>
            <Stack spacing={1}>
              <InputLabel>Client</InputLabel>
              <Select
                // label="Client"
                options={clientsOptions}
                path="clientUnitAuthority.clientId"
                state={state}
                sx={{
                  '&.MuiOutlinedInput-root': {
                    height: '39px !important',
                  },
                }}
              />
              <InputLabel>Business Unit</InputLabel>
              <Autocomplete
                className="dd"
                options={businessUnitOptions}
                state={state}
                path="clientUnitAuthority.businessUnits"
                // label="Type"
              />
            </Stack>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={onClickAddAuthority}
              disabled={
                !state.clientUnitAuthority.clientId ||
                state.clientUnitAuthority.businessUnits.length === 0
              }
            >
              Add
            </Button>
          </Grid>
          <Grid item xs={3} sx={{ mr: 2.5 }} className="paper-grid">
            <InputLabel sx={{ mb: 2 }}>Authorized List</InputLabel>
            <Box sx={{ overflow: 'auto' }}>
              {user?.authority?.whitelist.map((_whitelist) => {
                const onClickRemove = () => {
                  user.authority.whitelist = toJS(
                    user.authority.whitelist
                  ).filter((_wl) => _wl.clientId !== _whitelist.clientId)
                }

                const onClickRemoveBU = (businessUnitId: string) => {
                  const whitelist = user.authority.whitelist.find(
                    (_wl) => _wl.clientId === _whitelist.clientId
                  )
                  if (!whitelist) {
                    return
                  }
                  whitelist.businessUnits = toJS(
                    whitelist.businessUnits
                  ).filter((_bu) => _bu !== businessUnitId)
                }
                return (
                  <Box
                    sx={{
                      border: '1px solid gray',
                      borderRadius: '15px',
                      padding: '16px',
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <InputLabel sx={{ mb: 1 }}>Client</InputLabel>
                        <Box>
                          <Button onClick={onClickRemove}>
                            <Clear />
                          </Button>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        {props.clientUnits.find(
                          (_clientUnit) =>
                            _clientUnit._id === _whitelist.clientId
                        )?.name || 'not found'}
                      </Box>
                    </Box>
                    <Box>
                      <InputLabel sx={{ mb: 1, mt: 2 }}>
                        Business Units
                      </InputLabel>
                      {props.clientUnits
                        .find(
                          (_clientUnit) =>
                            _clientUnit._id === _whitelist.clientId
                        )
                        ?.businessUnits.filter((_bu) =>
                          _whitelist.businessUnits.includes(_bu._id)
                        )
                        .map((_bu) => (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Box>{_bu.name}</Box>
                            <Box>
                              <Button onClick={() => onClickRemoveBU(_bu._id)}>
                                <Clear />
                              </Button>
                            </Box>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Grid>
        </Grid>
      )
    }

    return (
      <Grid container spacing={2}>
        {userStore.users.map(renderUser)}
      </Grid>
    )
  }
)

export default observer(UserView)
