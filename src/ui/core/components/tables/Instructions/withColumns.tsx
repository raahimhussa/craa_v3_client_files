import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { AdminColumn, CellType, Type } from 'src/ui/core/components/DataGrid/DataGrid'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Instruction from 'src/ui/pages/admin/modals/Instruction/Instruction'
const withColumns: WrappingFunction = (WrappedComponent) => observer((props) => {
  const { uiState: { modal } } = useRootStore()
  const columns: Array<AdminColumn> = [
    {
      Header: 'TITLE',
      accessor: 'title',
      cellType: CellType.Editable,
      type: Type.String,
      collectionName: 'docs',
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
      edit: () => {
        modal.open('Instruction', <Instruction />)
      }
    }
  ]

  const meta = {
    columns,
  }

  return <WrappedComponent {...props} {...meta} />
})

export default withColumns
