import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { Button } from '@mui/material'
import CellButtons from '@components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import IFile from 'src/models/file/file.interface'
import PDFViewer from '../SimDocs/Finding/SelectedDocument/PDFViewer/PDFViewer'
import Uploader from '@components/Uploader/Uploader'
import { Utils } from '@utils'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props: any) => {
    const {
      uiState: { modal },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Filename',
        accessor: 'name',
        type: Type.String,
        collectionName: 'files',
        minWidth: 400,
        maxWidth: 700,
      },
      {
        Header: 'type',
        accessor: 'mimeType',
        type: Type.String,
        collectionName: 'files',
        // cellType: CellType.Editable,
        minWidth: 200,
        maxWidth: 700,
      },
      {
        Header: 'size',
        accessor: 'size',
        type: Type.String,
        Cell: (cellProps: CellProps<IFile>) => {
          const fileSize = cellProps.row.original.size || 0
          const convertedFileSize = Utils.bytesToMegaBytes(fileSize)
          return <div>{Math.round(convertedFileSize)}mb</div>
        },
        minWidth: 200,
        maxWidth: 700,
      },
      {
        Header: 'Added Date',
        accessor: 'createdAt',
        type: Type.Date,
        cellType: CellType.Date,
        minWidth: 200,
        maxWidth: 200,
      },
      {
        Header: 'PDF',
        accessor: 'url',
        Cell: (cellProps: CellProps<IFile>) => {
          const onClickView = () => {
            modal.open(
              'ViewFile',
              <PDFViewer fileUrl={cellProps.row.original.url} />
            )
          }
          return <Button onClick={onClickView}>View</Button>
        },
        minWidth: 200,
        maxWidth: 200,
      },
      {
        Header: 'Action',
        accessor: '_id',
        collectionName: 'files',
        Cell: CellButtons,
        storeKey: 'fileStore',
        mutateKey: 'files',
        edit: (_props) => {
          modal.open('Uploader', <Uploader fileId={_props.row.original._id} />)
        },
        minWidth: 200,
        maxWidth: 200,
      },
    ]

    const row = {
      selected: true,
    }

    const meta = {
      columns,
      row,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
