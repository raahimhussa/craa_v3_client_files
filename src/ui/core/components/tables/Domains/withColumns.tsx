import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import Domain from 'src/ui/pages/admin/Domain/Domain'
import Domains from 'src/ui/pages/admin/Domains/Domains'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const {
      keyConceptStore,
      uiState: { modal },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'ID',
        accessor: 'visibleId',
        collectionName: 'domains',
        // cellType: CellType.Editable,
        type: Type.String,
        minWidth: 100,
      },
      {
        Header: 'No',
        accessor: 'seq',
        collectionName: 'domains',
        // cellType: CellType.Editable,
        type: Type.String,
        minWidth: 100,
      },
      {
        Header: 'Domain',
        accessor: 'name',
        collectionName: 'domains',
        // cellType: CellType.Editable,
        type: Type.String,
        minWidth: 300,
      },
      {
        Header: 'Subdomains',
        accessor: '_id',
        cellType: CellType.SubComponent,
        renderRowSubComponent: ({ row }: any) => {
          return <Domains depth={1} parentId={row.original._id} isSub={true} />
        },
      },
      {
        Header: 'actions',
        collectionName: 'domains',
        storeKey: 'domainStore',
        Cell: CellButtons,
        minWidth: 150,
        edit: () => {
          modal.open('Domain', <Domain />)
        },
      },
    ]

    const meta = {
      columns: rest.isSub
        ? columns.filter((column) => column.cellType !== CellType.SubComponent)
        : columns,
    }

    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
