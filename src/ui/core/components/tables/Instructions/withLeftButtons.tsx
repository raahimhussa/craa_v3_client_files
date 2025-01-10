import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Instruction from 'src/ui/pages/admin/modals/Instruction/Instruction'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const { uiState: { modal }, docStore } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          docStore.resetForm()
          modal.open('Instruction', <Instruction />)
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
