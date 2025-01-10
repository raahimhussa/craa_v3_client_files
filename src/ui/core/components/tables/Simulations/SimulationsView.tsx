import DataGrid from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
function SimulationsView({ simulations, columns, state, leftButtons, rightButtons }: any) {
  return (
    <DataGrid
      state={state}
      columns={columns}
      leftButtons={leftButtons}
      rightButtons={rightButtons}
      data={simulations}
    />
  )
}
export default observer(SimulationsView)
