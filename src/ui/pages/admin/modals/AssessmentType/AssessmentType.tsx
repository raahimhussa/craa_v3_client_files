import { withFind, withState } from '@hocs'
import compose from '@shopify/react-compose'
import withFindOne from 'src/hocs/withFindOne'
import { uuid } from 'uuidv4'
import AssessmentTypeView from './AssessmentTypeView'

export type localStateType = ReturnType<typeof getState>

const getState = () => {
  return {
    form: {
      domainId: '',
      training: {
        domain: {
          _id: '',
          label: '',
        },
        _id: '',
        label: '',
        instructionIds: [],
        protocolIds: [],
        testTime: 8 * 60 * 60,
      },
      followup: {
        domain: {
          _id: '',
          label: '',
        },
        label: '',
        simulationId: '',
        studyLogIds: [],
        attemptCount: 5,
        instructionIds: [],
        protocolIds: [],
        testTime: 8 * 60 * 60,
      },
    },
  }
}

const getFilter = () => ({
  isDeleted: false,
})

const getCategoryFilter = () => ({
  depth: 0,
  isDeleted: false
})

export default compose<any>(
  withFind({ collectionName: 'docs', getFilter }),
  withFind({
    collectionName: 'domains',
    getFilter: getCategoryFilter,
    version: 2
  }),
  withFind({ collectionName: 'simulations', getFilter }),
  withFind({ collectionName: 'trainings', getFilter, version: 2 }),
  withState(getState)
)(AssessmentTypeView)
