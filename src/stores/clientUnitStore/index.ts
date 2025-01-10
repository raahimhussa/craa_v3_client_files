import {
  BusinessCycle,
  BusinessUnit,
  IClientUnit,
  SettingsByDomainId,
} from 'src/models/clientUnit/clientUnit.interface'
import { action, makeObservable, observable, toJS } from 'mobx'

import ClientUnitRepository from 'src/repos/v1/clientUnit'
import { GradeType } from 'src/utils/status'
import { RootStore } from '../root'
import { ScorerSettingDomain } from 'src/models/setting/setting.interface'
import Store from '../store'
import _ from 'lodash'
import axios from 'axios'
import { uuid } from 'uuidv4'

export enum UpdateType {
  ClientUnit = 'ClientUnit',
  BusinessUnit = 'BusinessUnit',
  BusinessCycle = 'BusinessCycle',
}

export default class ClientUnitStore extends Store<IClientUnit> {
  form: IClientUnit = {
    _id: null,
    name: '',
    authCode: '',
    isScreenRecordingOn: false,
    whitelist: [],
    businessUnits: [],
    titles: [],
  }
  businessUnitForm: BusinessUnit = {
    _id: '',
    name: '',
    countryIds: [],
    adminCountryIds: [],
    businessCycles: [],
  }
  businessCycleForm: BusinessCycle = {
    _id: '',
    assessmentCycleId: '',
    settingsByDomainIds: [],
    isScreenRecordingOn: false,
    gradeType: GradeType.Basic,
  }
  defaultForm: IClientUnit = _.cloneDeep(this.form)
  updateType: UpdateType = UpdateType.ClientUnit
  mutate: any = null
  constructor(store: RootStore, repository: ClientUnitRepository) {
    super(store, repository)
    makeObservable(this, {
      form: observable,
      businessUnitForm: observable,
      businessCycleForm: observable,
      updateType: observable,
    })
  }

  resetBusinessUnitForm() {
    this.businessUnitForm = {
      _id: '',
      name: '',
      countryIds: [],
      adminCountryIds: [],
      businessCycles: [],
    }
  }

  resetBusinessCycleForm() {
    this.businessCycleForm = {
      _id: '',
      assessmentCycleId: '',
      settingsByDomainIds: [],
      isScreenRecordingOn: true,
      gradeType: GradeType.Basic,
    }
  }

  addBusinessUnit() {
    const newBusinessUnit: BusinessUnit = this.businessUnitForm
    this.form.businessUnits.push(newBusinessUnit)
  }

  removeBusinessUnit(index: number) {
    this.form.businessUnits.splice(index, 1)
  }

  addBusinessCycle(scorerSettingDomain: ScorerSettingDomain[]) {
    const settingsByDomainIds: SettingsByDomainId[] = scorerSettingDomain.map(
      (_scorerSettingDomain) => ({
        domainId: _scorerSettingDomain._id,
        minScore: _scorerSettingDomain.minScore,
      })
    )
    const newBusinessCycle: BusinessCycle = {
      _id: '',
      assessmentCycleId: '',
      settingsByDomainIds,
      isScreenRecordingOn: true,
      gradeType: GradeType.Basic,
    }
    this.businessUnitForm.businessCycles.push(newBusinessCycle)
  }

  removeBusinessCycle(index: number) {
    this.businessUnitForm.businessCycles.splice(index, 1)
  }

  *update() {
    if (!this.form._id) return
    switch (this.updateType) {
      case UpdateType.ClientUnit: {
        yield axios.patch(`/v1/clientUnits/${this.form._id}`, this.form)
        break
      }
      case UpdateType.BusinessUnit: {
        if (this.businessUnitForm._id) {
          yield axios.patch(
            `/v1/clientUnits/${this.form._id}/${this.businessUnitForm._id}`,
            this.businessUnitForm
          )
        } else {
          yield axios.post(
            `/v1/clientUnits/${this.form._id}/${this.businessUnitForm._id}`,
            this.businessUnitForm
          )
        }
        break
      }
      case UpdateType.BusinessCycle: {
        yield axios.patch(
          `/v1/clientUnits/${this.form._id}/${this.businessUnitForm._id}/${this.businessCycleForm._id}`,
          this.businessCycleForm
        )
        break
      }
      default: {
        break
      }
    }
    this.resetForm()
    this.resetBusinessUnitForm()
    this.resetBusinessCycleForm()
    this.mutate && this.mutate()
  }

  async updateScreenRecordingOption(clientUnitId: string, toggle: boolean) {
    try {
      await axios.patch(
        `/v1/clientUnits/${clientUnitId}/screenRecording/${toggle}`
      )
    } catch (e) {
      throw e
    }
  }

  *delete() {
    if (!this.form._id) return
    yield axios.delete(`/v1/clientUnits/${this.form._id}`)
    this.resetForm()
    this.resetBusinessUnitForm()
    this.resetBusinessCycleForm()
    this.mutate && this.mutate()
  }
}
