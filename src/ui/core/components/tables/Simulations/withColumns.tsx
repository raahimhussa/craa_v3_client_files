import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { Button } from '@mui/material'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import DuplicateDialogue from '@components/DuplicateDialogue/DuplicateDialogue'
import Simulation from 'src/ui/pages/admin/Simulation/Simulation'
import { WrappingFunction } from '@shopify/react-compose'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

const withColumns: WrappingFunction = (WrappedComponent) =>
  observer((props) => {
    const {
      uiState: { modal, simulations },
    } = useRootStore()
    const columns: Array<AdminColumn> = [
      {
        Header: 'Name',
        accessor: 'name',
        minWidth: 200,
        type: Type.String,
      },
      {
        Header: 'Label',
        accessor: 'label',
        minWidth: 200,
        type: Type.String,
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
        minWidth: 200,
        type: Type.String,
        storeKey: 'simulationStore',
        mutateKey: 'simulations',
        Cell: CellButtons,
        edit: () => {
          modal.open('Simulation', <Simulation />)
        },
      },
      {
        Header: 'Duplicate',
        width: 100,
        Cell: (cellProps: CellProps<any>) => {
          const [open, setOpen] = useState<boolean>(false)
          const [label, setLabel] = useState<string>(
            `${cellProps.row.original.label} copy`
          )
          const simulation = cellProps.row.original

          const onClickOpen = () => {
            setOpen(true)
          }

          const onClickDuplicate = async () => {
            const _simulation = { ...simulation }
            delete _simulation._id
            delete _simulation.createdAt
            delete _simulation.updatedAt
            _simulation.label = label
            await axios.post('v1/simulations', _simulation)
            props.simulationsMutate && (await props.simulationsMutate())
          }

          const onChangeText = (text: string) => {
            setLabel(text)
          }
          return (
            <>
              <Button variant="contained" onClick={onClickOpen}>
                Duplicate
              </Button>
              <DuplicateDialogue
                open={open}
                handleClose={() => setOpen(false)}
                onDuplicate={onClickDuplicate}
                onChangeText={onChangeText}
                value={label}
                unit={'label'}
                title={`Are you sure you want to duplicate "${simulation.name}"?`}
                text={
                  "This item will be duplicated immediately. You can't undo this action."
                }
                yesText={'Duplicate'}
                noText={'Cancel'}
              />
            </>
          )
        },
      },
    ]

    const meta = {
      columns,
    }
    return <WrappedComponent {...props} {...meta} />
  })

export default withColumns
