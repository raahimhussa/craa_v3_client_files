import '@nosferatu500/react-sortable-tree/style.css'

import {
  Add,
  BookRounded,
  CloseFullscreen,
  FolderRounded,
  Fullscreen,
  Remove,
  Tonality,
  UnfoldLess,
  UnfoldMore,
  VerticalAlignBottom,
  VerticalAlignTop,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'
import { Box, Paper } from '@mui/material'
import _, { stubTrue } from 'lodash'
import { blue, green, grey, orange, red, yellow } from '@mui/material/colors'
import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import { DocumentType } from 'src/utils/status'
import Filters from './Filters/Filters'
import Finding from './Finding/Finding'
import Findings from './Findings/Findings'
import Folder from 'src/models/folder'
import FolderStore from 'src/stores/folderStore'
import { GenerateNodePropsParams } from 'src/ui/core/components/SortableTree/types'
import IDomain from 'src/models/domain/domain.interface'
import IFolder from 'src/models/folder/folder.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import Search from './Search/Search'
import SimDoc from 'src/models/simDoc'
import SimDocStore from 'src/stores/simDocStore'
import Simulation from 'src/models/simulation'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import SortableTree from 'src/ui/core/components/SortableTree/SortableTree'
import Swal from 'sweetalert2'
import TreeButtons from './TreeButtons/TreeButtons'
import axios from 'axios'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'

function SimDocsView(props: {
  simulations: Simulation[]
  simulationsMutate: any
  simDocs: ISimDoc[]
  simDocsMutate: any
  foldersMutate: any
  folders: IFolder[]
  onClickNewFolder: any
  domains: IDomain[]
}) {
  const {
    simulations,
    simulationsMutate,
    folders,
    simDocs,
    onClickNewFolder,
    foldersMutate,
    simDocsMutate,
    domains,
  } = props
  const { folderStore, simDocStore, findingStore, uiState } = useRootStore()
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [hideInactivate, setHideInactivate] = useState<boolean>(false)

  // 0: none, 1: name, 2: date created
  const [selectedOption, setSelectedOption] = useState<number>(0)
  const [searchString, setSearchString] = useState<string>('')

  const handleChangeSelectedOption = (e: any) => {
    setSelectedOption(e.target.value)
  }
  const handleChangeSearchString = (e: any) => {
    setSearchString(e.target.value)
  }
  const { enqueueSnackbar } = useSnackbar()

  // type: 0 = all ,1 = folder, 2 = document
  const sortBy = (type: number) => (a: any, b: any) => {
    if (type === 0) {
      switch (selectedOption) {
        case 0: {
          if (a.seq === b.seq) return a.createdAt > b.createdAt ? -1 : 1
          return a.seq > b.seq ? 1 : -1
        }
        default: {
          return 1
        }
      }
    } else if (type === 1) {
      switch (selectedOption) {
        case 0: {
          if (a.seq === b.seq) return a.createdAt > b.createdAt ? -1 : 1
          return a.seq > b.seq ? 1 : -1
        }
        case 1: {
          return a.name > b.name ? -1 : 1
        }
        case 2: {
          return a.name > b.name ? 1 : -1
        }
        case 3: {
          return a.createdAt > b.createdAt ? 1 : -1
        }
        case 4: {
          return a.createdAt > b.createdAt ? -1 : 1
        }
        default: {
          return 1
        }
      }
    } else if (type === 2) {
      switch (selectedOption) {
        case 0: {
          if (a.seq === b.seq) return a.createdAt > b.createdAt ? -1 : 1
          return a.seq > b.seq ? 1 : -1
        }
        case 1: {
          return a.title > b.title ? -1 : 1
        }
        case 2: {
          return a.title > b.title ? 1 : -1
        }
        case 3: {
          return a.createdAt > b.createdAt ? 1 : -1
        }
        case 4: {
          return a.createdAt > b.createdAt ? -1 : 1
        }
        default: {
          return 1
        }
      }
    }
    return 1
  }

  const getTreeData = () => {
    const rawFolders = {
      0: selectedSimulationId
        ? simulations
            .find((_simulation) => _simulation._id === selectedSimulationId)
            ?.folderIds.map((_folderId) =>
              folders.find((_folder) => _folder._id === _folderId)
            )
            .filter(
              (folder) =>
                folder &&
                folder.depth === 0 &&
                (hideInactivate ? folder.isActivated : true) &&
                folder.name.includes(searchString)
            )
            .map((folder) => new Folder(folderStore, folder as IFolder))
        : folders
            .filter(
              (folder) =>
                folder.depth === 0 &&
                (hideInactivate ? folder.isActivated : true) &&
                folder.name.includes(searchString)
            )
            .map((folder) => new Folder(folderStore, folder))
            .sort(sortBy(1)),
      1: folders
        .filter(
          (folder) =>
            folder.depth === 1 && (hideInactivate ? folder.isActivated : true)
        )
        .map((folder) => new Folder(folderStore, folder))
        .sort(sortBy(1)),
      2: folders
        .filter(
          (folder) =>
            folder.depth === 2 && (hideInactivate ? folder.isActivated : true)
        )
        .map((folder) => new Folder(folderStore, folder))
        .sort(sortBy(1)),
    }

    rawFolders[1].forEach((folder_1) => {
      folder_1.children = rawFolders[2].filter(
        (folder) =>
          folder.folderId === folder_1._id &&
          (hideInactivate ? folder.isActivated : true)
      )
      folder_1.children = folder_1.children
        .concat(
          simDocs
            .filter(
              (simDoc) =>
                simDoc.folderId === folder_1._id &&
                (hideInactivate ? simDoc.isActivated : true)
            )
            .map((simDoc) => new SimDoc(simDocStore, simDoc))
            .sort(sortBy(2))
        )
        .sort(sortBy(0))
    })

    rawFolders[0]?.forEach((folder_0) => {
      folder_0.children = rawFolders[1].filter(
        (folder) =>
          folder.folderId === folder_0._id &&
          (hideInactivate ? folder.isActivated : true)
      )
      folder_0.children = folder_0.children
        .concat(
          simDocs
            .filter(
              (simDoc) =>
                simDoc.folderId === folder_0._id &&
                (hideInactivate ? simDoc.isActivated : true)
            )
            .map((simDoc) => new SimDoc(simDocStore, simDoc))
            .sort(sortBy(2))
        )
        .sort(sortBy(0))
    })
    const _treeData = rawFolders[0]
    if (!_treeData) return []
    return _treeData?.filter((_folder: IFolder) => {
      if (!selectedSimulationId) return true
      const simulation = simulations.find(
        (_simulation) => _simulation._id === selectedSimulationId
      )
      return simulation?.folderIds.includes(_folder._id)
    })
  }

  useEffect(() => {
    folderStore.mutate = foldersMutate
    simDocStore.mutate = simDocsMutate

    return () => {
      findingStore.selectedSimDoc = null
    }
  }, [])

  // useEffect(() => {
  //   setTreeData(getTreeData())
  // }, [selectedOption, searchString, selectedSimulationId])

  const onKeyPressEnter = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    params: GenerateNodePropsParams
  ) => {
    if (e.key === 'Enter') {
      if (params.node.store instanceof FolderStore) {
        await folderStore.update(params.node._id, { name: params.node.name })
      } else {
        await simDocStore.update(params.node._id, { title: params.node.title })
      }
      enqueueSnackbar('Updated', { variant: 'success' })
    }
  }

  const onBlur = async (params: GenerateNodePropsParams) => {
    if (params.node.store instanceof FolderStore) {
      await folderStore.update(params.node._id, { name: params.node.name })
    } else {
      await simDocStore.update(params.node._id, { title: params.node.title })
    }
    enqueueSnackbar('Updated', { variant: 'success' })
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        sx={{
          width: '500px',
          height: 'calc(100vh - 150px)',
          overflow: 'scroll',
        }}
      >
        <Box sx={{ p: 1 }} />
        <Box sx={{ display: 'flex' }}>
          <button
            onClick={() => {
              setHideInactivate((prev) => !prev)
            }}
            style={{
              border: '1px solid grey',
              marginLeft: '8px',
              cursor: 'pointer',
            }}
          >
            {hideInactivate ? <VisibilityOff /> : <Visibility />}
          </button>
          <button
            onClick={async () => {
              isExpanded
                ? await folderStore.updateAll({}, { expanded: false })
                : await folderStore.updateAll({}, { expanded: true })
              await setIsExpanded((prev) => !prev)
            }}
            style={{
              border: '1px solid grey',
              marginLeft: '8px',
              marginRight: '8px',
              cursor: 'pointer',
            }}
          >
            {isExpanded ? <Remove /> : <Add />}
          </button>
          <Button
            variant="contained"
            onClick={() => onClickNewFolder(selectedSimulationId)}
          >
            New Folder
          </Button>
          <Box sx={{ ml: 2, backgroundColor: 'white' }}>
            <SimulationSelect
              setSelectedSimulationId={setSelectedSimulationId}
            />
          </Box>
        </Box>
        <Box sx={{ ml: 1, mt: 1, display: 'flex' }}>
          <Search
            searchString={searchString}
            handleChangeSearchString={handleChangeSearchString}
          />
          <Filters
            selectedOption={selectedOption}
            handleChangeSelectedOption={handleChangeSelectedOption}
          />
        </Box>
        <SortableTree
          style={{ height: 700 }}
          generateNodeProps={(params) => {
            const isFolder = params.node.store instanceof FolderStore
            const fontSize = 'small'
            const isDocumentEmpty = params.node.files?.length === 0

            let icon = null
            if (isFolder) {
              icon = (
                <FolderRounded fontSize={fontSize} htmlColor={orange[500]} />
              )
            } else if (params.node.kind === DocumentType.Document) {
              icon = (
                <BookRounded
                  fontSize={fontSize}
                  htmlColor={isDocumentEmpty ? grey[500] : blue[500]}
                />
              )
            } else if (params.node.kind === DocumentType.StudyMedication) {
              icon = <Tonality fontSize={fontSize} htmlColor={green[500]} />
            } else if (params.node.kind === DocumentType.RescueMedication) {
              icon = <Tonality fontSize={fontSize} htmlColor={red[700]} />
            }

            return {
              title: (
                <div
                  style={{
                    display: 'flex',
                  }}
                >
                  {icon}
                  <input
                    onChange={(e) => {
                      if (isFolder) {
                        params.node.name = e.target.value
                      } else {
                        params.node.title = e.target.value
                      }
                    }}
                    onBlur={() => onBlur(params)}
                    onKeyPress={(e) => onKeyPressEnter(e, params)}
                    style={{
                      border: '0px',
                      backgroundColor: 'transparent',
                    }}
                    defaultValue={
                      isFolder ? params.node.name : params.node.title
                    }
                  />
                </div>
              ),
              buttons: [
                <TreeButtons
                  {...params}
                  simDocsMutate={simDocsMutate}
                  foldersMutate={foldersMutate}
                  // updateTree={() => setTreeData(getTreeData())}
                />,
              ],
              style: {
                backgroundColor:
                  params.node._id === findingStore.selectedSimDoc?._id
                    ? 'rgba(255,255,0,0.5)'
                    : 'white',
                opacity: params.node.isActivated ? 1 : 0.35,
              },
            }
          }}
          onVisibilityToggle={async (props) => {
            if (props.node.store instanceof FolderStore) {
              await folderStore.update(props.node._id, {
                expanded: !props.node.expanded,
              })
            }
          }}
          maxDepth={3}
          canDrag={(canDropParams) => (selectedSimulationId ? true : false)}
          treeData={getTreeData()}
          onMoveNode={async (params) => {
            const { node, nextParentNode } = params
            if (node.store instanceof FolderStore) {
              if (nextParentNode) {
                await folderStore.update(node._id, {
                  $set: {
                    folderId: nextParentNode._id,
                    depth: nextParentNode.depth + 1,
                  },
                })
              } else {
                await folderStore.update(node._id, {
                  $set: {
                    folderId: null,
                    depth: 0,
                  },
                })
              }
              await foldersMutate()
            } else if (node.store instanceof SimDocStore) {
              await simDocStore.update(node._id, {
                $set: {
                  folderId: nextParentNode._id,
                },
              })
              await simDocsMutate()
            }
            if (nextParentNode && selectedSimulationId) {
              const siblings = params.nextParentNode.children
              const resolver = siblings.map(
                async (sibling: any, index: number) => {
                  if (sibling.store instanceof FolderStore) {
                    await axios.patch('/v2/folders', {
                      filter: {
                        _id: sibling._id,
                      },
                      update: {
                        $set: {
                          seq: index,
                        },
                      },
                    })
                  }
                  if (sibling.store instanceof SimDocStore) {
                    await axios.patch('/v1/simDocs', {
                      filter: {
                        _id: sibling._id,
                      },
                      update: {
                        $set: {
                          seq: index,
                        },
                      },
                    })
                  }
                }
              )
              await Promise.all(resolver)
              await foldersMutate()
              await simDocsMutate()
            }
            // await setTreeData(getTreeData())
          }}
          canNodeHaveChildren={(node) => {
            if (node.store instanceof FolderStore) return true
            return false
          }}
          onChange={async (changedTreeData) => {
            if (selectedSimulationId) {
              await axios.patch('/v1/simulations', {
                filter: {
                  _id: selectedSimulationId,
                },
                update: {
                  $set: {
                    folderIds: changedTreeData.map((ctd: any) => ctd._id),
                  },
                },
              })
              await simulationsMutate()
            }
            // setTreeData(changedTreeData)
          }}
        />
      </Box>
      <Box sx={{ height: 'calc(100vh - 150px)', overflow: 'scroll', flex: 1 }}>
        <Finding simDocs={simDocs} domains={domains} />
        {/* {findingStore.selectedSimDoc && <Findings buttons={false} simDoc={findingStore.selectedSimDoc} />} */}
      </Box>
    </Box>
  )
}
export default observer(SimDocsView)
