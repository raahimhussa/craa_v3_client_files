import AuthStore from 'src/stores/authStore'
import ScoringView from './ScoringsView'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getAssessmentFilter = ({ user }: { user: any }) => {
  if (user?.role?.priority === 0) {
    return {
      isDeleted: false,
    }
  } else if (user?.role?.priority === 7) {
    return {
      $or: [{ 'firstScorer._id': user._id }, { 'secondScorer._id': user._id }],
      isDeleted: false,
    }
  } else {
    return {
      _id: 'nothing to find',
    }
  }
}

export default compose<any>(
  withFind({
    collectionName: 'assessments',
    getFilter: getAssessmentFilter,
    version: 2,
  })
)(ScoringView)
