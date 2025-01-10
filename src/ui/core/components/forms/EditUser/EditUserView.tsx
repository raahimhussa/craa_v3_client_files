import { Analytics, Clear, Save } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  Autocomplete as MobXAutoComplete,
  Select as MobXSelect,
  TextField,
} from 'src/ui/core/components'
import {
  Card,
  FormLabel,
  Grid,
  IconButton,
  Input,
  TextField as LocalTextField,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'
import { useEffect, useMemo, useState } from 'react'

import AssignToUser from './AssignToUser/AssignToUser'
import { BusinessUnit } from 'src/models/clientUnit/clientUnit.interface'
import ClientUnit from 'src/models/clientUnit'
import { ClientUnitAuthority } from 'src/models/user/types'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { EmailVerificationButton } from './EmailVerificationButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import { Role } from 'src/models/role'
import SendEmailDialogue from '@components/SendEmailDialouge/SendEmailDialogue'
import Swal from 'sweetalert2'
import axios from 'axios'
import { green } from '@mui/material/colors'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

type Props = {
  clientUnits: ClientUnit[]
  roles: Role[]
  countries: any[]
  businessUnits: BusinessUnit[]
  usersMutate: any
}

function EditUserView(props: Props) {
  const {
    userStore,
    uiState: { users },
  } = useRootStore()
  const rootStore = useRootStore()
  const [age, setAge] = useState('')
  const [password, setPassword] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const { clientUnits, roles, countries, businessUnits, usersMutate } = props

  const state = useLocalObservable<{
    clientUnitAuthority: ClientUnitAuthority
  }>(() => ({
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

  useEffect(() => {
    userStore.form.password = undefined
  }, [])

  type Datas = {
    _id: string
    title: string
    name: string
  }

  const clientsOptions = clientUnits.map((clientUnit) => ({
    text: clientUnit.name,
    value: clientUnit._id,
  }))

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
    const whitelist = userStore.form.authority.whitelist
    if (
      whitelist.find(
        (_whitelistItem) =>
          _whitelistItem.clientId === state.clientUnitAuthority.clientId
      )
    ) {
      whitelist.forEach((_whitelistItem) => {
        if (_whitelistItem.clientId === state.clientUnitAuthority.clientId)
          _whitelistItem.businessUnits = state.clientUnitAuthority.businessUnits
      })
    } else {
      whitelist.push(toJS(state.clientUnitAuthority))
    }
  }

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }
  return (
    <DetailLayout store={userStore} mutate={usersMutate}>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'white',
          height: 'calc(100vh - 72px)',
          overflow: 'auto',
        }}
      >
        <Box sx={{ width: '500px' }}>
          <Card sx={{ p: 3, m: 3 }} className="paper-grid">
            <FormControl
              fullWidth
              sx={{
                '& .MuiTextField-root': { mt: 3 },
              }}
            >
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                label="Role"
                value={userStore.form.roleId}
                onChange={(e) => {
                  userStore.form.roleId = e.target.value
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              >
                {roles.map(({ _id, title }) => (
                  <MenuItem value={_id} key={_id}>
                    {title}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                disabled
                label="Username"
                variant="outlined"
                state={userStore}
                path="form.name"
              />
              <TextField
                label="Email"
                variant="outlined"
                state={userStore}
                path="form.email"
              />
              {/* <TextField
                disabled
                label="Password"
                variant="outlined"
                state={userStore}
                path="form.password"
              /> */}
              <TextField
                label="Region"
                variant="outlined"
                state={userStore}
                placeholder={'Region'}
                // path="form"
                disabled
              />
              <FormControl sx={{ mt: 2 }}>
                <InputLabel id="demo-simple-select-label">Title</InputLabel>
                <Select
                  label="Title"
                  value={userStore.form.profile?.title!}
                  onChange={(e) => {
                    if (userStore.form.profile !== null) {
                      userStore.form.profile.title = e.target.value
                    }
                  }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                >
                  {/* @ts-ignore */}
                  {userStore.form.client?.titles.map((title) => (
                    <MenuItem value={title} key={title}>
                      {title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="clinical Experience"
                variant="outlined"
                state={userStore}
                placeholder={'clinical Experience'}
                // path="form.name"
              />
              <TextField
                label="Internal Development"
                variant="outlined"
                state={userStore}
                placeholder={'Internal Development'}
                // path="form.name"
              />
              <TextField
                label="ID"
                variant="outlined"
                state={userStore}
                placeholder={'ID'}
                // path="form.name"
              />
              <TextField
                label="Type"
                variant="outlined"
                state={userStore}
                placeholder={'Type'}
                // path="form.name"
              />
              <TextField
                label="Degree"
                variant="outlined"
                state={userStore}
                placeholder={'Degree'}
                // path="form.name"
              />
              <TextField
                label="Certification"
                variant="outlined"
                state={userStore}
                placeholder={'Certification'}
                // path="form.name"
              />
              {/* <Button
                  size="medium"
                  variant="contained"
                  sx={{ mt: 3, width: '30%', mx: 'auto' }}
                >
                  Submit
                </Button> */}
            </FormControl>
          </Card>
          <Card sx={{ p: 3, m: 3 }} className="paper-grid">
            <InputLabel
              sx={{
                mb: 1,
              }}
            >
              Reset Password
            </InputLabel>
            <Box sx={{ display: 'flex' }}>
              <LocalTextField
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                size="small"
                sx={{
                  width: 80,
                  bgcolor: green[500],
                  py: '1.15rem !important',
                }}
                variant="contained"
                onClick={async () => {
                  try {
                    await axios.patch('v1/users/password', {
                      _id: toJS(userStore.form._id),
                      password,
                    })
                    enqueueSnackbar('password changed', {
                      variant: 'success',
                    })
                  } catch (e) {
                    console.error(e)
                    enqueueSnackbar('failed to change password', {
                      variant: 'error',
                    })
                  }
                }}
              >
                <Save />
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box>
                <InputLabel
                  sx={{
                    mb: 1,
                    mt: 2,
                  }}
                >
                  Reset 2FA
                </InputLabel>
                <Switch
                  //@ts-ignore
                  checked={userStore.form.otpData?.otp_enabled}
                  //@ts-ignore
                  disabled={!userStore.form.otpData?.otp_enabled}
                  onChange={async () => {
                    try {
                      await axios.post('v1/users/otp/disable', {
                        user_id: toJS(userStore.form._id),
                      })
                      //@ts-ignore
                      userStore.form.otpData = {}
                      enqueueSnackbar('2FA Disabled.', {
                        variant: 'success',
                      })
                    } catch (e) {
                      console.error(e)
                      enqueueSnackbar('failed to disable 2FA', {
                        variant: 'error',
                      })
                    }
                  }}
                  sx={{
                    ml: -1,
                  }}
                />
              </Box>
              <Box sx={{ ml: 4 }}>
                <EmailVerificationButton
                  defaultEmail={toJS(userStore.form.email)}
                  user={toJS(userStore.form)}
                />
              </Box>
            </Box>
          </Card>
          <Card sx={{ p: 3, m: 3 }} className="paper-grid">
            <FormControl
              fullWidth
              sx={{
                '& .MuiTextField-root': { mt: 3 },
              }}
            >
              <TextField
                label="First name"
                variant="outlined"
                state={userStore}
                path={`form.profile.firstName`}
                placeholder={'First name'}
              />
              <TextField
                label="Last name"
                variant="outlined"
                state={userStore}
                path={`form.profile.lastName`}
                placeholder={'Last name'}
              />
              <TextField
                disabled
                label="Initial"
                variant="outlined"
                state={userStore}
                path={`form.profile.initial`}
                placeholder={'Initial'}
              />
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel id="demo-simple-select-label">Country</InputLabel>
                <Select
                  label="Country"
                  value={userStore.form.profile?.countryId}
                  onChange={handleChange}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                >
                  {countries.map(({ _id, name }: Datas) => (
                    <MenuItem value={_id} key={_id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Monitoring Experience"
                variant="outlined"
                state={userStore}
                path={`form.profile.monitoring`}
                placeholder={'Monitoring Experience'}
              />
            </FormControl>
          </Card>
          <Box sx={{ height: '12px' }}></Box>
        </Box>
        <Box sx={{ maxWidth: '600px', width: 'calc(100% - 500px)' }}>
          <Card sx={{ p: 3, m: 3 }} className="paper-grid">
            {roles.find((_role) => _role.priority === 6)?._id ===
            userStore.form.roleId ? (
              <AssignToUser userId={userStore.form._id} />
            ) : null}
            {roles.find((_role) => _role.priority === 4 || _role.priority === 5)
              ?._id === userStore.form.roleId ? (
              <Box>
                {/* <Grid item xs={3} sx={{ mr: 2.5 }} className="paper-grid"> */}
                <InputLabel sx={{ mb: 2 }}>Authorization</InputLabel>
                <Stack spacing={1}>
                  <InputLabel>Client</InputLabel>
                  <MobXSelect
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
                  <MobXAutoComplete
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
                  sx={{ mt: 2, mb: 4 }}
                  onClick={onClickAddAuthority}
                  disabled={
                    !state.clientUnitAuthority.clientId ||
                    state.clientUnitAuthority.businessUnits.length === 0
                  }
                >
                  Add
                </Button>
                {/* </Grid> */}
                <InputLabel sx={{ mb: 2 }}>Authorized List</InputLabel>
                <Box sx={{ overflow: 'auto' }}>
                  {userStore.form?.authority?.whitelist.map((_whitelist) => {
                    const onClickRemove = () => {
                      userStore.form.authority.whitelist = toJS(
                        userStore.form.authority.whitelist
                      ).filter((_wl) => _wl.clientId !== _whitelist.clientId)
                    }

                    const onClickRemoveBU = (businessUnitId: string) => {
                      const whitelist = userStore.form.authority.whitelist.find(
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
                                  <Button
                                    onClick={() => onClickRemoveBU(_bu._id)}
                                  >
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
              </Box>
            ) : null}
          </Card>
        </Box>
      </Paper>
    </DetailLayout>
  )
}
export default observer(EditUserView)
