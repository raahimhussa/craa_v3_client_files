import Box from '@components/mui/layout/Box/Box'
import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function UserStatusView({
  userStatusManagement,
  columns,
  state,
  leftButtons,
  rightButtons,
  height,
}: any) {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 130px)',
        overflowY: 'scroll',
      }}
    >
      <DataGrid
        buttons={false}
        state={state}
        columns={columns}
        leftButtons={leftButtons}
        rightButtons={rightButtons}
        data={userStatusManagement}
        height={height}
      />
    </Box>
  )
}
export default observer(UserStatusView)
