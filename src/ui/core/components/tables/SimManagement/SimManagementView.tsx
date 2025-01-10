import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { Box } from '@mui/material'
function SimManagementView({
  data,
  columns,
  state,
  leftButtons,
  rightButtons,
}: any) {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 150px)',
        overflowY: 'scroll',
      }}
    >
      <DataGrid
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={data}
      />
    </Box>
  )
}
export default observer(SimManagementView)
