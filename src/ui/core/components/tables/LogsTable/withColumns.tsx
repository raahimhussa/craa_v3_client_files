import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props: any) => {
    const columns: Array<AdminColumn> = [
      {
        Header: 'Event',
        accessor: 'event',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 100,
      },
      {
        Header: 'Screen',
        accessor: 'screen',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 50,
      },
      {
        Header: 'VP1 Doc Title',
        accessor: 'viewports.0.simDoc.title',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 250,
      },
      {
        Header: 'VP2 Doc Title',
        accessor: 'viewports.1.simDoc.title',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 250,
      },
      {
        Header: 'VP3 Doc Title',
        accessor: 'viewports.2.simDoc.title',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 250,
      },
      {
        Header: 'VP1-Page',
        accessor: 'viewports.0.simDoc.currentPage',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 50,
      },
      {
        Header: 'VP2-Page',
        accessor: 'viewports.1.simDoc.currentPage',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 50,
      },
      {
        Header: 'Note text',
        accessor: 'note.text',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 250,
      },
      {
        Header: 'Viewport No',
        accessor: 'note.viewport.index',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 50,
      },
      {
        Header: 'Note Document Title',
        accessor: 'note.viewport.simDoc.title',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 250,
      },
      {
        Header: 'Note Document Page',
        accessor: 'note.viewport.simDoc.currentPage',
        type: Type.String,
        collectionName: 'logs',
        minWidth: 100,
      },
      {
        Header: 'Duration',
        accessor: 'duration',
        type: Type.Number,
        collectionName: 'logs',
        minWidth: 100,
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
