export default interface IDomain {
  _id?: any
  visibleId?: string
  seq: number
  name: string
  isDeleted?: boolean
  parentId: string
  depth: number
  createdAt?: Date
  updatedAt?: Date
}
