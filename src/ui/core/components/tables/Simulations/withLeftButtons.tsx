import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Simulation from 'src/ui/pages/admin/Simulation/Simulation'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const { uiState: { modal }, simulationStore } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          simulationStore.resetForm()
          modal.open('Simulation', <Simulation />)
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
