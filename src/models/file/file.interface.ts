export default interface IFile {
  _id?: any
  mimeType: string
  name: string
  url: string
  totalPage?: number
  currentPage?: number
  scale?: number
  size?: number
  isDeleted?: boolean
  createdAt?: Date
  updatedAt?: Date
}
