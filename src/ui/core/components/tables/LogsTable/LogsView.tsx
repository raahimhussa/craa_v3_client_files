import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function LogsView({ logs, columns, state, leftButtons, rightButtons }: any) {
  return (
    <DataGrid
      buttons={false}
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={logs}
    />
  )
}
export default observer(LogsView)
