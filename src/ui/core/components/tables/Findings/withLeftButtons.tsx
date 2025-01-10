import Finding from 'src/ui/pages/admin/Finding/Finding'
import ImportFindings from 'src/ui/pages/admin/ImportFindings/ImportFindings'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const {
      dialogStore,
      findingStore,
      uiState: { modal },
    } = useRootStore()

    const leftButtons = [
      {
        title: 'Import',
        onClick: () => {
          modal.open('ImportFindings', <ImportFindings />)
          // dialogStore.dialog.type = 'success'
          // dialogStore.dialog.isVisible = true
          // dialogStore.dialog.title = 'Findings'
          // dialogStore.dialog.content = <Finding isNew={true} />
        },
        color: 'primary',
      },
      {
        title: 'NEW',
        onClick: () => {
          findingStore.resetForm()
          findingStore.selectedSimDoc = null
          modal.open('Finding', <Finding isNew={true} />)
          // dialogStore.dialog.type = 'success'
          // dialogStore.dialog.isVisible = true
          // dialogStore.dialog.title = 'Findings'
          // dialogStore.dialog.content = <Finding isNew={true} />
        },
        color: 'primary',
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
