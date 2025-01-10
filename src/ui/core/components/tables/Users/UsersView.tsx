import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { Box } from '@mui/material'
function UsersView({
  users,
  columns,
  state,
  leftButtons,
  rightButtons,
  ...rest
}: any) {
  return (
    <DataGrid
      {...rest}
      state={state}
      columns={columns}
      // leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={users}
    />
  )
}
export default observer(UsersView)
