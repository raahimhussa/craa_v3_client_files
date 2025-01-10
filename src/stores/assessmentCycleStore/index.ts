import _ from 'lodash'
import { makeObservable, observable } from 'mobx'
import IAssessmentCycle, { Tutorials } from 'src/models/assessmentCycle/assessmentCycle.interface'
import AssessmentCycleRepository from 'src/repos/v1/assessmentCycleRepository'
import { RootStore } from '../root'
import Store from '../store'
export default class AssessmentCycleStore extends Store<IAssessmentCycle> {
  form: IAssessmentCycle = {
    _id: null,
    name: '',
    tutorials: {
      followupUrl: '',
      baselineUrl: '',
      trainingUrl: '',
    },
    assessmentTypeIds: [],
    startDate: new Date(),
    endDate: new Date(),
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  defaultForm: IAssessmentCycle = _.cloneDeep(this.form)
  constructor(store: RootStore, repository: AssessmentCycleRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
  }
}
