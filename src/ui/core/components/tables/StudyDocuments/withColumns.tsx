import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import StudyDocument from 'src/ui/pages/admin/modals/StudyDocument/StudyDocument'
import StudyDocuments from './StudyDocuments'
const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const { uiState: { modal } } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'TITLE',
        accessor: 'title',
        cellType: CellType.Editable,
        collectionName: 'docs',
        type: Type.Number,
        minWidth: 300,
      },
      {
        Header: 'added Date',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 150,
      },
      {
        Header: 'Actions',
        collectionName: 'docs',
        storeKey: 'docStore',
        mutateKey: 'docs',
        Cell: CellButtons,
        minWidth: 150,
        edit: () => {
          modal.open('Document', <StudyDocument />)
        }
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
