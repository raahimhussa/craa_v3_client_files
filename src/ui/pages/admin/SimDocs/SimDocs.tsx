import { withFind } from '@hocs'
import compose from '@shopify/react-compose'
import SimDocsView from './SimDocsView'
export enum DocKind {
  Protocol = 'protocol',
  Instruction = 'instruction',
  StudyDocument = 'studyDocument',
}

const getFilter = () => ({
  isDeleted: false,
})

const getDocsFilter = () => ({
  isDeleted: false,
})

const getOptions = () => ({
  sort: {
    createdAt: -1,
  },
})

export default compose<any>(
  withFind({
    collectionName: 'docs',
    getFilter: getDocsFilter,
    getOptions,
    uiStoreKey: 'docs'
  }),
  withFind({
    collectionName: 'simDocs',
    getFilter,
  })
)(SimDocsView)
