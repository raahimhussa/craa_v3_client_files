import { IScreenRecorder } from 'src/models/screenRecorder/IScreenRecorder'
import { IStore } from '../types'
import { RootStore } from '../root'
import RouterStore from '../routerStore'
import { ScreenRecorder } from 'src/models/screenRecorder'
import ScreenRecorderRepository from 'src/repos/v2/screenRecorder'
import { makeAutoObservable } from 'mobx'

export default class ScreenRecorderStore implements IStore {
  rootStore: RootStore
  router: RouterStore
  screenRecorders: ScreenRecorder[] = []
  screenRecorderRepository: ScreenRecorderRepository
  girdSize: number = 12
  video: HTMLVideoElement | null = null
  videoIndex: number = 0
  recordId: string = ''
  duration: number | undefined = 0
  form: any
  delete: any

  constructor(
    rootStore: RootStore,
    screenRecorderRepository: ScreenRecorderRepository
  ) {
    this.rootStore = rootStore
    this.router = rootStore.routerStore
    this.screenRecorderRepository = screenRecorderRepository
    this.duration = this.video?.duration
    makeAutoObservable(this)
  }

  loadData(data: IScreenRecorder[]) {
    this.screenRecorders = data.map((data: IScreenRecorder) => {
      return new ScreenRecorder(data)
    })
  }

  play(duration: number, total: number) {
    if (this.video) {
      this.video?.pause()
      let sub = total - this.video.duration
      this.video.currentTime =
        this.videoIndex != 0 ? duration - sub - 3 : duration - 3
      this.video.play()
    }
  }
}
