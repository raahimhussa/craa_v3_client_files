import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import StudyDocument from 'src/ui/pages/admin/modals/StudyDocument/StudyDocument'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const { uiState: { modal }, docStore } = useRootStore()

    const leftButtons = [
      {
        title: 'New',
        onClick: () => {
          docStore.resetForm()
          modal.open('Study Documents', <StudyDocument />)
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
