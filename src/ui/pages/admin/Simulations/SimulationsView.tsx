import PaginationTable from 'src/ui/components/PaginationTable'
import Simulations from 'src/ui/core/components/tables/Simulations/Simulations'
import { observer } from 'mobx-react'
// @ts-ignore
function SimulationsView(props) {
  return (
    <PaginationTable
      collectionName="simulations"
      version={1}
      params={{
        filter: { isDeleted: false },
        options: { multi: true },
      }}
      Table={Simulations}
    />
  )
}
export default observer(SimulationsView)
