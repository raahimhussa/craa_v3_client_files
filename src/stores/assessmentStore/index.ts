import { AssessmentStatus, ScorerStatus } from 'src/utils/status'
import { makeObservable, observable } from 'mobx'

import AssessmentRepository from 'src/repos/v2/assessment'
import CommonDAO from 'src/commons/interfaces/commonDAO.interface'
import { IAssessment } from 'src/models/assessment/assessment.interface'
import Identifiable from 'src/commons/interfaces/identifiable.interface'
import { RootStore } from '../root'
import Store from '../store'
import _ from 'lodash'
import axios from 'axios'

export default class AssessmentStore extends Store<IAssessment> {
  form: IAssessment = {
    _id: null,
    userSimulationId: '',
    isExpedited: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    firstScorer: {
      _id: '',
      status: ScorerStatus.HasNotStarted,
      scoringTime: 0,
    },
    secondScorer: {
      _id: '',
      status: ScorerStatus.HasNotStarted,
      scoringTime: 0,
    },
    adjudicator: {
      _id: '',
      status: ScorerStatus.HasNotStarted,
    },
    status: '',
    publishedAt: null,
    userAssessmentCycle: undefined,
  }

  defaultForm: IAssessment = _.cloneDeep(this.form)
  constructor(store: RootStore, repository: AssessmentRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
    })
  }

  async submitScoring(assessment: IAssessment) {
    const isFirstScorer =
      this.rootStore.authStore.user._id === assessment.firstScorer._id

    const isSecondScorer =
      this.rootStore.authStore.user._id === assessment.secondScorer._id

    if (isFirstScorer) {
      await axios.patch(
        `v3/scoringManagement/assessments/${assessment._id}/firstScorer/scoring`
      )
    }
    if (isSecondScorer) {
      await axios.patch(
        `v3/scoringManagement/assessments/${assessment._id}/secondScorer/scoring`
      )
    }
  }

  async submitAdjudicate(assessment: IAssessment) {
    const isAdjudicator =
      this.rootStore.authStore.user._id === assessment.adjudicator._id

    if (isAdjudicator) {
      await axios.patch(
        `v3/scoringManagement/assessments/${assessment._id}/adjudicator/scoring`
      )
    }
  }

  async publish(assessment: IAssessment) {
    try {
      await axios.patch(`v2/assessments/${assessment._id}/publish`)
    } catch (error) {
      throw error
    }
  }

  async scoreResult(assessment: IAssessment) {
    try {
      await axios.patch(`v2/assessments/${assessment._id}/preview`)
    } catch (error) {
      throw error
    }
  }

  async changeStatus(
    assessmentId: string,
    type: 'firstScorer' | 'secondScorer' | 'adjudicator',
    status: ScorerStatus
  ) {
    const update = {
      $set: { [`${type}.status`]: status },
    }
    if (type === 'adjudicator') {
      update.$set.status = ScorerStatus.InProgress
    }
    return this.repository.update({
      filter: {
        _id: assessmentId,
      },
      update,
    })
  }
}
