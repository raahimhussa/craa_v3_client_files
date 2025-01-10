import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Protocol from 'src/ui/pages/admin/modals/Protocol/Protocol'
const withColumns: WrappingFunction = (WrappedComponent) => observer((props) => {
  const { uiState: { modal } } = useRootStore()
  const columns: Array<AdminColumn> = [
    {
      Header: 'TITLE',
      accessor: 'title',
      cellType: CellType.Editable,
      type: Type.String,
      collectionName: 'docs',
      mutateKey: 'docs',
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
      modalKey: 'protocol',
      Cell: CellButtons,
      storeKey: 'docStore',
      mutateKey: 'docs',
      edit: () => {
        modal.open('Protocol', <Protocol />)
      }
    },
  ]

  const meta = {
    columns,
  }

  return <WrappedComponent {...props} {...meta} />
})

export default withColumns
