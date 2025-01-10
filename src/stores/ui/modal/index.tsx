import { makeAutoObservable } from 'mobx'
import UiState from '..'

export default class Modal {
  uiState: UiState
  children: React.ReactNode
  isVisible: boolean = false
  payload: any = {}

  constructor(uiState: UiState) {
    this.uiState = uiState
    makeAutoObservable(this, {
      uiState: false
    })
  }

  getChildren() {
    return this.children
  }

  open(title: string, children: React.ReactNode, payload?: any) {
    this.payload = payload
    this.uiState.detailLayout.label = title
    this.children = children
    this.isVisible = true
  }

  close() {
    this.isVisible = false
    this.payload = {}
  }
}