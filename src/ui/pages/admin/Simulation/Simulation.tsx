import SimulationView from './SimulationView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
export default compose<any>(
  withFind({
    collectionName: 'folders',
    getFilter: () => ({
      isDeleted: false,
      depth: 0,
    }),
    version: 2,
  })
)(SimulationView)
