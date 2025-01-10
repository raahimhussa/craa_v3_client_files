import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import AssessmentType from 'src/ui/pages/admin/modals/AssessmentType/AssessmentType'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state } = props
    const { uiState: { modal }, assessmentTypeStore } = useRootStore()

    const leftButtons = [
      {
        title: 'NEW',
        onClick: () => {
          assessmentTypeStore.resetForm()
          modal.open('AssessmentType', <AssessmentType />)
        },
        color: 'primary',
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} state={state} />
  })

export default withLeftButtons
