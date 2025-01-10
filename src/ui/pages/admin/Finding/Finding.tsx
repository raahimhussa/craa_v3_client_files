import FindingView from './FindingView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
export default compose<any>(
  withFind({
    collectionName: 'simDocs',
    getFilter: () => ({ isDeleted: false }),
    version: 1,
  }),
  withFind({
    collectionName: 'domains',
    getFilter: () => ({ isDeleted: false }),
    version: 2,
  })
)(FindingView)
