import { Box, Button, Divider, Typography } from '@mui/material'

import File from 'src/models/file'
import FileSelect from '@components/FileSelect/FileSelect'
import PDFViewer from './PDFViewer/PDFViewer'
import SimDoc from 'src/models/simDoc'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useState } from 'react'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'

type Props = {
  simDocId: string
  simDoc: SimDoc
  simDocMutate: any
  files: File[]
}

function FindingsView({ simDocId, simDoc, simDocMutate, files }: Props) {
  const {
    uiState: { modal },
  } = useRootStore()
  const file = simDoc.files.length > 0 ? files[0] : null

  const onClickView = () => {
    if (!file) return
    modal.open('ViewFile', <PDFViewer fileUrl={file.url} />)
  }
  const onClickSelect = () => {
    modal.open(
      'SelectFile',
      <FileSelect simDocMutate={simDocMutate} simDocId={simDocId} />
    )
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <Box />
        <Box>
          <Button
            sx={{ marginRight: '12px' }}
            disabled={!file}
            onClick={onClickView}
            variant="contained"
          >
            View File
          </Button>
          <Button onClick={onClickSelect} variant="contained">
            Select File
          </Button>
        </Box>
      </Box>
      <Box>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'gray' }}>Name</Typography>
          <Typography>{file?.name ? file?.name : '-'}</Typography>
          <Divider />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'gray' }}>Type</Typography>
          <Typography>{file?.mimeType ? file?.mimeType : '-'}</Typography>
          <Divider />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '11px', color: 'gray' }}>Size</Typography>
          <Typography>{file?.size ? file?.size : '-'}</Typography>
          <Divider />
        </Box>
      </Box>
    </Box>
  )
}
export default compose<any>(
  withFind({
    collectionName: 'files',
    getFilter: (props: any) => {
      const file = props.simDoc.files.length > 0 ? props.simDoc.files[0] : null
      return {
        _id: file?._id,
      }
    },
  })
)(observer(FindingsView))
