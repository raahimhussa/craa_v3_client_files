import { Autocomplete, TextField } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import { MobxUtil } from '@utils'
import { reaction } from 'mobx'

interface Option {
  text: string
  value: string
}

function SelectView(props: any) {
  const { options = [], state = {}, path = '', label = '' } = props

  const defaultOptionValue = MobxUtil._get(state, path) || ''
  const localState: {
    option: Option | null
  } = useLocalObservable(() => ({
    option:
      options.find((option: Option) => defaultOptionValue === option.value) ||
      null,
  }))

  reaction(
    () => localState.option,
    () => MobxUtil._set(state, path, localState.option?.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    (value) => {
      localState.option =
        options.find((option: Option) => value === option.value) || null
    }
  )

  return (
    <Autocomplete
      {...props}
      options={options}
      // @ts-ignore
      getOptionLabel={(option) => option.text}
      onChange={(e: any, newOption: Option | null) => {
        localState.option = newOption
      }}
      value={localState.option}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            size="medium"
            label={label}
            sx={{
              '&.MuiOutlinedInput-root': {
                height: '50px !important',
              },
            }}
          />
        )
      }}
    />
  )
}
export default observer(SelectView)
