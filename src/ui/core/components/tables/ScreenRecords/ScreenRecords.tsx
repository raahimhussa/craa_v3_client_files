import ScreenRecordersView from './ScreenRecordsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

const getScreenRecroderFilter = (props: any) => {
  return {
    userSimulationId: props.userSimulationId,
    // userId: props.userId,
    isDeleted: false,
  }
}
const getNoteFilter = (props: any) => {
  return {
    'viewport.userSimulationId': props.userSimulationId,
    // userId: props.userId,
    isDeleted: false,
  }
}

export default compose<any>(
  withFindOne({
    collectionName: 'screenRecorders',
    getFilter: getScreenRecroderFilter,
    version: 2,
  }),
  withFind({
    collectionName: 'notes',
    getFilter: getNoteFilter,
    version: 2,
  })
)(ScreenRecordersView)
