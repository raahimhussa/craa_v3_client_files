import BuStatusView from './BuStatusView'
import compose from '@shopify/react-compose'
import { stringify } from 'stylis'
import { withFind } from '@hocs'
import withREST from 'src/hocs/withREST'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withREST({
    collectionName: 'clientUnits',
    path: () => 'filter',
    params: (props) => {
      const { authorization } = props
      return authorization
    },
    version: 1,
  }),
  withFind({
    collectionName: 'assessmentCycles',
    getFilter,
  })
)(BuStatusView)
