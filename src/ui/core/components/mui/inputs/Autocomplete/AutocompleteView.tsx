import { Autocomplete, TextField } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'
import { reaction, toJS } from 'mobx'

import { MobxUtil } from '@utils'
import { useSnackbar } from 'notistack'

function AutocompleteView(props: any) {
  const {
    state = {},
    path = '',
    options = [],
    multiple = true,
    onChange: _onChange,
    label = '',
    limitTags = 1,
    max = -1,
    maxErrorMessage = '',
  } = props

  const { enqueueSnackbar } = useSnackbar()

  const localState = useLocalObservable(() => ({
    value: MobxUtil._get(state, path) || [],
  }))

  const value = options.filter((option: any) =>
    localState.value.includes(option.value)
  )

  reaction(
    () => localState.value,
    () => MobxUtil._set(state, path, localState.value)
  )

  reaction(
    () => MobxUtil._get(state, path),
    () => (localState.value = MobxUtil._get(state, path))
  )

  const getOptionLabel = (option: any) => {
    return option.text
  }
  const onChange = (event: any, selectedOptions: any) => {
    if (max > 0 && selectedOptions.length > max)
      return enqueueSnackbar(maxErrorMessage || 'too many tags', {
        variant: 'error',
      })
    const selectedValues = selectedOptions.map((option: any) => option.value)
    localState.value.replace(selectedValues)
    if (_onChange) {
      _onChange()
    }
  }

  return (
    <Autocomplete
      className="buAutocomplete"
      {...props}
      limitTags={limitTags}
      ChipProps={{
        sx: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          '&.MuiChip-root': {
            height: '22.5px !important',
            margin: '0 !important',
          },
        },
      }}
      multiple={multiple}
      onChange={onChange}
      options={options}
      getOptionLabel={getOptionLabel}
      // defaultValue={defaultValue}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          variant={'outlined'}
          label={label}
        />
      )}
    />
  )
}
export default observer(AutocompleteView)
