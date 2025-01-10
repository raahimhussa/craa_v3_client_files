import { CssBaseline, IconButton, Menu, MenuItem } from '@mui/material'
import { green, red } from '@mui/material/colors'
import { observer, useLocalObservable } from 'mobx-react'

import DeleteDialogue from '@components/DeleteDialogue/DeleteDialogue'
import Folder from 'src/models/folder'
import { GenerateNodePropsParams } from 'src/ui/core/components/SortableTree/types'
import { MoreVert } from '@mui/icons-material'
import { toJS } from 'mobx'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

const TreeButtons = (
  props: GenerateNodePropsParams & {
    simDocsMutate: any
    foldersMutate: any
    // updateTree: () => void
  }
) => {
  const { folderStore, findingStore } = useRootStore()
  const state: {
    anchorEl: any
    open: boolean
  } = useLocalObservable(() => ({
    open: false,
    anchorEl: null,
  }))
  const [deleteDialogueOpen, setDeleteDialogueOpen] = useState<boolean>(false)

  const handleDeleteDialogueOpen = () => {
    setDeleteDialogueOpen(true)
  }

  const handleDeleteDialogueClose = () => {
    setDeleteDialogueOpen(false)
  }

  return (
    <>
      <CssBaseline />
      <IconButton
        onClick={(e) => {
          state.anchorEl = e.currentTarget
          state.open = !state.open
        }}
      >
        <MoreVert />
      </IconButton>
      <Menu
        onClose={() => (state.open = false)}
        anchorEl={state.anchorEl}
        open={state.open}
      >
        {folderStore
          .menuItems(
            props.node.isActivated,
            props.simDocsMutate,
            props.foldersMutate
          )
          .filter((item) => {
            if (props.lowerSiblingCounts.length < 2) return true
            if (item.name !== 'New Folder') return true
            return false
          })
          ?.map((item) => {
            const folderFilterTypes = ['all', 'folder']
            const documentFilterTypes = ['all', 'document']

            const isFolder = props.node instanceof Folder

            if (isFolder) {
              if (!folderFilterTypes.includes(item.type)) {
                return null
              }
            } else {
              if (!documentFilterTypes.includes(item.type)) {
                return null
              }
            }
            return (
              <MenuItem
                sx={{ color: item.name === 'Delete' ? red[900] : green[900] }}
                onClick={
                  item.name === 'Delete'
                    ? () => {
                        handleDeleteDialogueOpen()
                      }
                    : async () => {
                        state.open = false
                        await item.onClick(props)
                        // await props.updateTree()
                      }
                }
                key={uniqid()}
              >
                {item.name}
                {item.name === 'Delete' ? (
                  <DeleteDialogue
                    open={deleteDialogueOpen}
                    handleClose={handleDeleteDialogueClose}
                    onDelete={async () => {
                      state.open = false
                      await item.onClick(props)
                      if (props.node._id === findingStore.selectedSimDoc?._id) {
                        findingStore.selectedSimDoc = null
                      } else {
                        //FIXME - when folder is deleted
                        findingStore.selectedSimDoc = null
                      }
                      // await props.updateTree()
                    }}
                    title={`Are you sure you want to delete ${
                      props.node.title
                        ? `"${
                            props.node.title.length > 20
                              ? props.node.title.substring(0, 20) + '...'
                              : props.node.title
                          }"`
                        : 'item'
                    }?`}
                    text={
                      "This item will be deleted immediately. You can't undo this action."
                    }
                    yesText={'Delete'}
                    noText={'Cancel'}
                  />
                ) : null}
              </MenuItem>
            )
          })}
      </Menu>
    </>
  )
}

export default observer(TreeButtons)
