import { observer } from 'mobx-react'
import { Box, Stack, TextField } from 'src/ui/core/components'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import Editor from 'src/ui/core/components/Editor/Editor'
import { useRootStore } from 'src/stores'
import { useEffect } from 'react'
import { DocKind } from 'src/models/doc/doc.interface'
import { InputLabel } from '@mui/material'

function InstructionView() {
  const {
    docStore,
    uiState: { docs },
  } = useRootStore()
  useEffect(() => {
    docStore.form.kind = DocKind.Instruction
  }, [])
  return (
    <DetailLayout store={docStore} mutate={docs.mutate}>
      <Stack spacing={2} sx={{ p: 2, bgcolor: 'white' }}>
        <InputLabel>Title</InputLabel>
        <TextField
          state={docStore}
          path="form.title"
          placeholder="Title"
          variant="outlined"
          size="small"
        />
        <Editor state={docStore} path="form.htmlContent" />
      </Stack>
    </DetailLayout>
  )
}
export default observer(InstructionView)
