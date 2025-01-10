import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    // const { modal } = useRootStore()
    const leftButtons: any = [
      // {
      //   title: 'ADD',
      //   onClick: () => {
      //     modalStore.businessUnit.isVisible = true
      //   },
      //   color: 'primary',
      // },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
