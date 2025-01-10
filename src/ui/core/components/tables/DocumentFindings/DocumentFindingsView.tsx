import { Box } from '@mui/material'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function DocumentFindingsView({
  findings,
  columns,
  state,
  leftButtons,
  rightButtons,
  ...rest
}: any) {
  return (
    <Box sx={{ marginTop: '24px' }}>
      <Box sx={{ fontWeight: 700 }}>Findings</Box>
      <DataGrid
        {...rest}
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={findings}
      />
    </Box>
  )
}
export default observer(DocumentFindingsView)
