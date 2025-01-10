import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import Box from '@mui/material/Box'
import { observer } from 'mobx-react'
function AssessmentCyclesView({
  assessmentCycles,
  columns,
  state,
  leftButtons,
  rightButtons,
}: any) {

  return (
    <Box sx={{ height: 80 }}>
      <DataGrid
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={assessmentCycles}
      />
    </Box>
  )
}
export default observer(AssessmentCyclesView)
