import compose from '@shopify/react-compose'
import AssessmentCyclesView from './AssessmentCyclesView'
import { withFind, withState } from '@hocs'
import withColumns from './withColumns'
import withLeftButtons from './withLeftButtons'
import withRightButtons from './withRightButtons'
const getState = (props: any) => {
  return {
    assessmentCycles: props.assessmentCycles,
    selectedRowIds: [],
  }
}

export default compose<any>(
  withFind({
    collectionName: 'assessmentCycles',
    getFilter: () => ({
      isDeleted: false,
    }),
    uiStoreKey: 'assessmentCycles'
  }),
  withState(getState),
  withColumns,
  withLeftButtons,
  withRightButtons
)(AssessmentCyclesView)
