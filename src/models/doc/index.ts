import { makeObservable, observable } from 'mobx'
import DocStore from 'src/stores/docStore'
import Model from '../model'
import IDoc, { DocKind } from './doc.interface'

export class Doc extends Model<IDoc, DocStore> implements IDoc {
  constructor(store: DocStore, data: IDoc) {
    super(store, data)
    makeObservable(this, {
      _id: observable,
      kind: observable,
      title: observable,
      htmlContent: observable,
      file: observable,
      isDeleted: observable,
      createdAt: observable,
      updatedAt: observable,
    })
  }
  _id: any = null
  kind: DocKind | null = null
  title: string = ''
  htmlContent: string = ''
  file: File | null = null
  isDeleted: boolean = false
  createdAt: Date = new Date()
  updatedAt: Date = new Date()
}
