import { UserSimulationStatus, UserStatus } from 'src/utils/status'

import Answer from '../answer'
import { UserSimulationDoc } from './types'

export default interface IUserBaseline {
  readonly userId: string
  readonly assessmentTypeId: string
  readonly usageTime: number
  readonly testTime: number
  readonly results: Result
  readonly status: UserSimulationStatus
  readonly attemptCount: number
  readonly instructions: UserSimulationDoc[]
  readonly protocols: UserSimulationDoc[]
  readonly studyLogs: UserSimulationDoc[]
  readonly isDeleted: boolean
  readonly startedAt: number
}

export class Result {
  scoreByDomain!: ScoreByDomain[]
  scoreByMainDomain!: ScoreByDomain[]
  identifiedScoreBySeverity!: {
    severity: number
    identifiedFindings: string[]
    notIdentifiedFindings: string[]
    allFindings: string[]
  }[]
  identifiedScoreByDomain!: {
    domainId: string
    identifiedFindings: string[]
    notIdentifiedFindings: string[]
    allFindings: string[]
  }[]
  identifiedScoreByMainDomain!: {
    domainId: string
    identifiedFindings: string[]
    notIdentifiedFindings: string[]
    allFindings: string[]
  }[]
  identifiedAnswers!: Answer[]
  notIdentifiedAnswers!: Answer[]
}

export type ScoreByDomain = {
  domainId: string
  name: string
  correctAnswersCount: number
  incorrectAnswersCount: number
  allAnswersCount: number
  pass: boolean
  minScore: number
  score: number
}
