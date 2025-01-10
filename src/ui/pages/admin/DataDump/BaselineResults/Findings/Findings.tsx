import FindingsView from './FindingsView'
import compose from '@shopify/react-compose'
import { withFind } from '@hocs'

const getFilter = () => ({
  isDeleted: false,
})

export default compose<any>(
  withFind({
    collectionName: 'users',
    getFilter: ({
      identifiedFindings,
    }: {
      identifiedFindings: {
        [domainId: string]: { findingId: string; userIds: string[] }
      }
    }) => {
      const userIds: string[] = []
      Object.values(identifiedFindings).forEach((_identifiedFindings) => {
        _identifiedFindings.userIds.forEach((_userId) => userIds.push(_userId))
      })
      return {
        _id: { $in: Array.from(new Set(userIds)) },
      }
    },
  })
)(FindingsView)
