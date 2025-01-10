export default interface IBookmark {
  readonly _id: any
  text: string
  userId: string
  duration: number
  userSimulationId: string
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
  isPrivate: boolean
}
