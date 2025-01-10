import { DocumentType } from 'src/utils/status'

export interface ISimDoc {
  _id?: any
  kind: DocumentType
  title: string
  seq?: number
  files: any[]
  numberOfPillsToShow: number
  numberOfPillsTakenBySubject: number
  numberOfPillsPrescribed: number

  folderId: string | null

  expanded?: boolean
  isActivated: boolean

  totalPage: number
  currentPage: number
  scale: number

  isDeleted?: boolean
  createdAt?: number
  updatedAt?: number
}
