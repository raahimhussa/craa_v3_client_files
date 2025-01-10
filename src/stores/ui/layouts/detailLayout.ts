import { KeyedMutator } from 'swr'
import { RootStore } from 'src/stores/root'
import UiState from '..'
import axios from 'axios'
import { makeAutoObservable } from 'mobx'

export default class DetailLayout {
  uiState: UiState
  label: string = ''

  constructor(uiState: UiState) {
    this.uiState = uiState
    makeAutoObservable(this, {
      uiState: false,
    })
  }

  *save(store: RootStore[keyof RootStore], mutate?: KeyedMutator<any> | null) {
    this.uiState.modal.close()
    try {
      // @ts-ignore
      if (!store.form._id) yield store.create()
      // @ts-ignore
      else yield store.update()
    } catch (error) {
      return this.uiState.alert.error()
    }
    mutate && mutate()
  }

  close() {
    this.uiState.modal.close()
  }
}
