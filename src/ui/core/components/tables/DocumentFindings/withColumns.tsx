import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { Box } from '@mui/material'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import Domain from './columns/Domain/Domain'
import Finding from 'src/ui/pages/admin/Finding/Finding'
import SimDocs from './columns/SimDocs/SimDocs'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const {
      uiState: { modal },
    } = useRootStore()
    const columns: AdminColumn[] = [
      {
        Header: 'id',
        accessor: 'visibleId',
        width: '72px',
        type: Type.String,
      },
      {
        Header: 'Text',
        accessor: 'text',
        storeKey: 'findingStore',
        mutateKey: 'findings',
        width: '350px',
        Cell: (props: any) => {
          return (
            <Box
              sx={{
                lineHeight: '18px',
                width: '100%',
                whiteSpace: 'normal',
                overflowX: 'auto',
              }}
            >
              {props.row.original.text}
            </Box>
          )
        },
      },
      // {
      //   Header: 'Severity',
      //   accessor: 'severity',
      //   type: Type.String,
      // },
      // {
      //   Header: 'Status',
      //   accessor: 'status',
      //   type: Type.String,
      // },
      {
        Header: 'Domain',
        accessor: 'domainId',
        width: '200px',
        // type: Type.String,
        Cell: (props: any) => {
          return <Domain value={props.value} />
        },
      },
      // {
      //   Header: 'CFR',
      //   accessor: 'cfr',
      //   type: Type.String,
      // },
      // {
      //   Header: 'ICH_GCP',
      //   accessor: 'ich_gcp',
      //   type: Type.String,
      // },
      {
        Header: 'Documents to compare with',
        accessor: 'simDocIds',
        width: '200px',
        // type: Type.String,
        Cell: (props: any) => {
          return <SimDocs value={props.value} />
        },
      },
      {
        Header: 'Actions',
        Cell: CellButtons,
        storeKey: 'findingStore',
        mutateKey: 'findings',
        width: '168px',
        edit: () => {
          modal.open('Finding', <Finding />)
        },
      },
    ]

    const meta = {
      columns,
    }
    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
