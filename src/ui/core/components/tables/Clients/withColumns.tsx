import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import BusinessUnit from 'src/ui/pages/admin/BusinessUnit/BusinessUnit'
import BusinessUnits from './BusinessUnits/BusinessUnits'
import { Button } from 'src/ui/core/components'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import Client from 'src/ui/pages/admin/Client/Client'
import { Switch } from '@mui/material'
import { UpdateType } from 'src/stores/clientUnitStore'
import { WrappingFunction } from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      clientUnitStore,
      uiState: { modal },
    } = useRootStore()

    const columns: Array<AdminColumn> = [
      {
        Header: 'ClientName',
        accessor: 'name',
        type: Type.String,
        // cellType: CellType.Editable,
        // mutateKey: 'clients',
        collectionName: 'clientUnits',
        minWidth: 250,
      },
      {
        Header: 'AuthCode',
        accessor: 'authCode',
        type: Type.String,
        minWidth: 200,
      },
      // {
      //   Header: 'ScreenRecording',
      //   accessor: 'isScreenRecordingOn',
      //   minWidth: 200,
      //   Cell: ({ row }: any) => {
      //     return (
      //       <Switch
      //         checked={row.original?.isScreenRecordingOn}
      //         onChange={(e) => {
      //           clientUnitStore.updateScreenRecordingOption(
      //             row.original._id,
      //             e.target.checked
      //           )
      //         }}
      //       />
      //     )
      //   },
      // },
      {
        Header: 'SHOW BU',
        cellType: CellType.SubComponent,
        renderRowSubComponent: ({ row }: any) => {
          return (
            <BusinessUnits
              buttons={false}
              clientUnit={row.original}
              clientUnitsMutate={props.clientUnitsMutate}
            />
          )
        },
      },
      {
        Header: 'ADD-BU',
        Cell: observer(({ row }: any) => {
          const onClickAddBU = () => {
            clientUnitStore.form = row.original
            clientUnitStore.resetBusinessUnitForm()
            clientUnitStore.addBusinessUnit()
            clientUnitStore.updateType = UpdateType.BusinessUnit
            clientUnitStore.mutate = props.clientUnitsMutate
            modal.open('BusinessUnit', <BusinessUnit />)
          }
          return (
            <Button
              fullWidth={false}
              variant="outlined"
              sx={{ width: 100 }}
              onClick={onClickAddBU}
            >
              New
            </Button>
          )
        }),
      },
      {
        Header: 'CreatedAt',
        accessor: 'createdAt',
        cellType: CellType.Date,
        minWidth: 200,
      },
      {
        Header: 'UpdatedAt',
        accessor: 'updatedAt',
        cellType: CellType.Date,
        minWidth: 200,
      },
      {
        Header: 'Actions',
        collectionName: 'clientUnits',
        Cell: CellButtons,
        storeKey: 'clientUnitStore',
        mutateKey: 'clientUnits',
        edit: () => {
          clientUnitStore.mutate = props.clientUnitsMutate
          modal.open('Client', <Client />)
        },
      },
    ]

    const meta = {
      columns,
    }

    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
