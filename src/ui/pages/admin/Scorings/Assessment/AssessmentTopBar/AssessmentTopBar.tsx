import AssessmentTopBarView from './AssessmentTopBarView'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'

const getAssessmentsFilter = ({
  userSimulation,
}: {
  userSimulation: UserSimulation
}) => {
  return {
    userSimulationId: userSimulation._id,
    isDeleted: false,
  }
}

export default compose<any>(
  withFindOne({
    collectionName: 'assessments',
    version: 2,
    getFilter: getAssessmentsFilter,
  })
)(AssessmentTopBarView)
