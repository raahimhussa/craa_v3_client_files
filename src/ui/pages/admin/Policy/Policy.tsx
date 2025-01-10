import PolicyView from './PolicyView'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import withClientMeta from '../../../core/components/tables/Clients/withColumns'
import withRenameColumn from 'src/hocs/withRenameColumn'
import withRoutePaths from '../../../navigation/Root/withMeta'
import withUserColumns from '../../../core/components/tables/SimManagement/withColumns'
export interface IRoute {
  text: string
  checked: boolean
}

// const getState = ({
//   routePaths = []
// }) => {
//   const routes = Object.values(routePaths).map(path => ({
//     text: path,
//     checked: false,
//   }))

//   return ({
//     routes
//   })
// }

export default compose<any>(
  withUserColumns,
  withRenameColumn('scoringCols'),
  withClientMeta,
  withRenameColumn('clientCols'),
  withRoutePaths
  // withState(getState),
  // withMenus,
  // withMeta
)(PolicyView)
