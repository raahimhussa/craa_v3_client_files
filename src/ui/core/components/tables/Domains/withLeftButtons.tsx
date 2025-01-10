import Domain from 'src/ui/pages/admin/Domain/Domain'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, parentId } = props
    const {
      modalStore,
      domainStore,
      uiState: { modal },
    } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          // modalStore.domain.isVisible = true
          domainStore.form.parentId = parentId
          if (parentId) domainStore.form.depth = 1
          else domainStore.form.depth = 0
          modal.open('Domain', <Domain />)
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
