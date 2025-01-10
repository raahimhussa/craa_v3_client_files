import { SelectProps as MuiSelectProps } from '@mui/material/Select'
import SelectView from './SelectView'
import compose from '@shopify/react-compose'

type SelectProps = MuiSelectProps & {
  state: any
  path: string
  options: Array<any>
  onClickOption?: () => void
}

export default compose<SelectProps>()(SelectView)
