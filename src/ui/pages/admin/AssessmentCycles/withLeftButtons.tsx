import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import AssessmentCycle from '../AssessmentCycle/AssessmentCycle'
const withLeftButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { uiState: { modal }, assessmentCycleStore } = useRootStore()
    const leftButtons = [
      {
        title: 'New',
        onClick: () => {
          assessmentCycleStore.resetForm()
          modal.open('AssessmentCycle', <AssessmentCycle />)
        },
      },
    ]

    return <WrappedComponent {...props} leftButtons={leftButtons} />
  })

export default withLeftButtons
