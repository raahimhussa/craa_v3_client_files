import { observer } from 'mobx-react'
import { Box, TextField } from 'src/ui/core/components'
import { useEffect } from 'react'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import Files from 'src/ui/core/components/tables/Files/Files'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import {
  Alert,
  AlertTitle,
  CardContent,
  CardHeader,
  InputLabel,
} from '@mui/material'
import { useRootStore } from 'src/stores'
import { DocKind } from 'src/models/doc/doc.interface'

function ProtocolView(props: any) {
  const { state, files } = props
  const {
    docStore,
    uiState: { docs },
  } = useRootStore()

  useEffect(() => {
    docStore.form.kind = DocKind.Protocol
  }, [])

  useEffect(() => {
    if (state.selectedRowIds.length > 0) {
      docStore.form.file = files?.find((file: any) =>
        state.selectedRowIds.includes(file._id)
      )
    }
  }, [JSON.stringify(state.selectedRowIds)])

  return (
    <DetailLayout store={docStore} mutate={docs.mutate}>
      <Box sx={{ bgcolor: 'rgb(242, 243, 243)', p: 2, height: '100vh' }}>
        <Grid container>
          <Grid item xs={12} className="paper-grid" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <InputLabel sx={{ mb: 1 }}>Title</InputLabel>
              <TextField
                state={docStore}
                path="form.title"
                variant="outlined"
                placeholder="Title"
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            className="paper-grid"
            sx={{ height: 'calc(100vh - 220px)' }}
          >
            <Files buttons={false} files={files} state={state} />
          </Grid>
          <Grid item xs={6}>
            {docStore.form.file && (
              <Card>
                <CardHeader title={docStore.form.file.name} />
                <CardContent>
                  <Alert severity="warning">
                    <AlertTitle>Select only one file</AlertTitle>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </DetailLayout>
  )
}
export default observer(ProtocolView)
