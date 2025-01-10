import Clients from 'src/ui/core/components/tables/Clients/Clients'
import { observer } from 'mobx-react'
function ClientsView({ clientUnits, clientUnitsMutate }: any) {
  return (
    <Clients clientUnits={clientUnits} clientUnitsMutate={clientUnitsMutate} />
  )
}
export default observer(ClientsView)
