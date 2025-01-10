import Finding from 'src/ui/pages/admin/Finding/Finding'
import FindingSelect from './FindingSelect/FindingSelect'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, findingsMutate } = props
    const {
      findingStore,
      uiState: { modal },
    } = useRootStore()

    const leftButtons = [
      {
        title: 'Add Finding',
        onClick: () => {
          // findingStore.resetForm()
          // findingStore.form.simDocId = props?.simDocId ? props.simDocId : ''
          modal.open(
            'AddFinding',
            <FindingSelect
              simDocId={props.simDocId ? props.simDocId : ''}
              findingsMutate={findingsMutate}
            />
          )
        },
        color: 'primary',
        sx: { mr: 5 },
      },
    ]

    return (
      <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
    )
  })

export default withLeftButtons
