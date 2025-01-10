import { Divider, Typography } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import File from 'src/models/file'
import Files from 'src/ui/core/components/tables/Files/Files'
import SimDoc from 'src/models/simDoc'
import { useRootStore } from 'src/stores'

type Props = {
  files: File[]
  simDocId: string
  simDocMutate: any
}

function FileSelectView(props: Props) {
  const { files, simDocId, simDocMutate } = props

  const {
    uiState: { modal },
    simDocStore,
  } = useRootStore()
  const localState = useLocalObservable(() => ({
    selectedRowIds: [],
  }))

  const onClickSelect = async () => {
    const filesByFilteredById = files.filter((file: any) =>
      // @ts-ignore
      localState.selectedRowIds.includes(file._id)
    )
    await simDocStore.update(simDocId, { files: filesByFilteredById })
    simDocMutate && simDocMutate()
    modal.close()
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: 'white' }}>
      <Box sx={{ width: '100%' }}>
        <Button variant="contained" fullWidth onClick={onClickSelect}>
          Select
        </Button>
        <Box sx={{ height: 300, overflow: 'auto' }}>
          <Files buttons={false} files={files} state={localState} />
        </Box>
      </Box>
    </Box>
  )
}
export default observer(FileSelectView)
