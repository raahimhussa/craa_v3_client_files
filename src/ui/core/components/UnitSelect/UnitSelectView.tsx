import { InputAdornment, TextField } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import { MobxUtil } from '@utils'
import { reaction } from 'mobx'

function UnitSelectView(props: any) {
  const { state = {}, path = '', unit = 'hour' } = props

  const localState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || 0,
  }))

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.value = MobxUtil._get(state, path))
  )

  const onChange:
    | React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
    | undefined = (event) => {
    if (parseInt(event.target.value) > 0) {
      localState.value = parseInt(event.target.value)
    }
  }

  return (
    <TextField
      {...props}
      size="small"
      variant="outlined"
      type="number"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ pl: 1 }}>
            {unit}
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={onChange}
      value={localState.value}
    />
  )
}
export default observer(UnitSelectView)
