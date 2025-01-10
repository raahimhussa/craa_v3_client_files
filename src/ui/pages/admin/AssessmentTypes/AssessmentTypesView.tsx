import AssessmentTypes from 'src/ui/core/components/tables/AssessmentTypes/AssessmentTypes'
import { observer } from 'mobx-react'
function AssessmentTypesView(props: any) {
  return <AssessmentTypes {...props} />
}
export default observer(AssessmentTypesView)
