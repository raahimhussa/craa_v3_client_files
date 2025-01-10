import SimDistributionsView from './SimDistributionsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
  // status: {
  //   $eq: AssessmentStatus.Published
  // }
})

export default compose<any>(
  withFind({
    collectionName: 'assessments',
    version: 2,
    getFilter,
    propName: 'simDistributions',
  }),
  withFind({
    collectionName: 'userSimulations',
    version: 2,
    getFilter,
  })
)(SimDistributionsView)
