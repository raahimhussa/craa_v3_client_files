import _ from 'lodash'
import { makeObservable, observable } from 'mobx'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import IAssessmentType, {
  ATBaseline,
} from 'src/models/assessmentType/assessmentType.interface'
import AssessmentTypeRepository from 'src/repos/v1/assessmenType'
import { RootStore } from '../root'
import Store from '../store'
export default class AssessmentTypeStore extends Store<IAssessmentType> {
  form: IAssessmentType & Identifiable = {
    _id: null,
    label: '',
    baseline: new ATBaseline(),
    followups: [],
    trainings: [],
    isDeleted: false,
    createdAt: undefined,
    updatedAt: undefined,
  }
  defaultForm: IAssessmentType & Identifiable = _.cloneDeep(this.form)
  constructor(store: RootStore, repository: AssessmentTypeRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
  }
}
