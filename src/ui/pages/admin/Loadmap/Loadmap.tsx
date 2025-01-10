import LoadmapView from './LoadmapView'
import UserSimulation from 'src/models/userSimulation'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'
import withUiStore from 'src/hocs/withUiStore'

export default compose<any>(
  withFind({
    collectionName: 'domains',
    version: 2,
    getFilter: () => ({
      isDeleted: false,
      depth: 0,
    }),
  }),
  withFind({
    collectionName: 'logs',
    version: 2,
    getFilter: (props: any) => ({
      'viewports.0.userSimulationId': props.userSimulation?._id,
      // event: 'select simDoc',
    }),
  }),
  withFind({
    collectionName: 'notes',
    version: 2,
    getFilter: (props: any) => ({
      'viewport.userSimulationId': props.userSimulation?._id,
    }),
  })
)(LoadmapView)
