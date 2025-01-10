import FileSelect from 'src/ui/core/components/FileSelect/FileSelect'
import { FindingSeverity } from 'src/models/finding/finding.interface'
import Folder from 'src/models/folder'
import FolderRepository from 'src/repos/v2/folderRepository'
import { GenerateNodePropsParams } from 'src/ui/core/components/SortableTree/types'
import IFolder from 'src/models/folder/folder.interface'
import { IStore } from '../types'
import { RootStore } from '../root'
import Swal from 'sweetalert2'
import axios from 'axios'
import { makeAutoObservable } from 'mobx'

export interface IFinding {
  readonly _id: any
  text: string
  severity: number
  seq: number
  cfr: string
  ich_gcp: string
  simDocId: string
  domainId: string
  simDocIds: string[]
  status: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export default class FolderStore implements IStore {
  rootStore: RootStore
  folderRepository: FolderRepository
  folders: any = {}
  mutate: any
  form: IFolder = {
    name: 'untitled folder',
    depth: 0,
    folderId: null,
    expanded: true,
    isActivated: true,
  }

  menuItems = (
    isActivated: boolean,
    simDocsMutate: any,
    foldersMutate: any
  ): Array<{
    name: string
    onClick: (props: GenerateNodePropsParams) => void
    type: string
  }> => [
    {
      name: 'New Folder',
      onClick: async (props) => {
        if (props.node.depth + 1 > 1)
          return Swal.fire({ title: 'Maximum Depth', icon: 'warning' })
        await this.create(props.node._id, props.node.depth + 1)

        await simDocsMutate()

        await foldersMutate()
      },
      type: 'folder',
    },
    {
      name: 'Resources',
      onClick: async (props) => {
        this.rootStore.findingStore.resetForm()
        this.rootStore.findingStore.selectedSimDoc = props.node
      },
      type: 'document',
    },
    {
      name: 'New Document',
      onClick: async (props) => {
        try {
          await this.rootStore.simDocStore.create(props.node._id)
        } catch (error) {
          if (axios.isAxiosError(error)) return error.response
        }

        await simDocsMutate()

        await foldersMutate()
      },
      type: 'folder',
    },
    {
      name: isActivated ? 'Deactivate' : 'Activate',
      onClick: async (props) => {
        try {
          await this.rootStore.simDocStore.update(props.node._id, {
            $set: {
              isActivated: !isActivated,
            },
          })
        } catch (error) {
          if (axios.isAxiosError(error)) return error.response
        }

        await simDocsMutate()

        await foldersMutate()
      },
      type: 'document',
    },
    {
      name: isActivated ? 'Deactivate' : 'Activate',
      onClick: async (props) => {
        try {
          this.update(props.node._id, {
            $set: {
              isActivated: !isActivated,
            },
          })
        } catch (error) {
          if (axios.isAxiosError(error)) return error.response
        }

        await simDocsMutate()

        await foldersMutate()
      },
      type: 'folder',
    },
    {
      name: 'Delete',
      onClick: async (props) => {
        if (props.node instanceof Folder) {
          await this.delete(props.node._id)
        } else {
          await this.rootStore.simDocStore.delete(props.node._id)
        }

        await simDocsMutate()

        await foldersMutate()
      },
      type: 'all',
    },
  ]

  constructor(rootStore: RootStore, folderRepository: FolderRepository) {
    this.rootStore = rootStore
    this.folderRepository = folderRepository
    makeAutoObservable(this)
  }

  loadData(data: any) {
    this.folders = data.map((folder: IFolder) => new Folder(this, folder))
  }

  *delete(folderId: string) {
    try {
      yield this.folderRepository.update({
        filter: { _id: folderId },
        update: { isDeleted: true },
      })
    } catch (error) {
      return Swal.fire({
        title: 'Error',
        icon: 'error',
      })
    }
    this.mutate()
    return Swal.fire({
      title: 'Success',
      icon: 'success',
    })
  }

  *update(folderId: string, update: any) {
    try {
      yield this.folderRepository.update({
        filter: { _id: folderId },
        update,
      })
    } catch (error) {
      return Swal.fire({
        title: 'Error',
        icon: 'error',
      })
    }
    this.mutate()
  }

  *updateAll(filter: any, update: any) {
    try {
      yield this.folderRepository.update({
        filter,
        update,
      })
    } catch (error) {
      return Swal.fire({
        title: 'Error',
        icon: 'error',
      })
    }
    this.mutate()
  }

  *create(folderId = null, depth = 0) {
    this.form.folderId = folderId
    this.form.depth = depth
    let newFolder: IFolder | null = null
    try {
      newFolder = yield this.folderRepository.create(this.form)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response)
      }
    }
    return newFolder
  }
}
