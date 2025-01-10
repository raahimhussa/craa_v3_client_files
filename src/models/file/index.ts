import { makeAutoObservable } from 'mobx'
import IFile from 'src/models/file/file.interface'
import FileStore from 'src/stores/fileStore'
import { IModel } from '../types'

export default class File implements IModel, IFile {
  store: FileStore
  _id?: any
  name: string = ''
  mimeType: string = ''
  url: string = ''
  totalPage?: number | undefined
  currentPage?: number | undefined
  scale?: number | undefined
  size?: number | undefined
  isDeleted?: boolean | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined

  constructor(store: FileStore, data: IFile) {
    this.store = store
    makeAutoObservable(this, {
      store: false,
    })
    Object.assign(this, data)
  }

  load(data: any) {
    Object.assign(this, data)
  }
}
