import {
  AdminColumn,
  CellType,
  Type,
} from 'src/ui/core/components/DataGrid/DataGrid'

import { Box } from '@mui/material'
import CellButtons from 'src/ui/core/components/cells/CellButtons/CellButtons'
import { CellProps } from 'react-table'
import Domain from './columns/Domain/Domain'
import Finding from 'src/ui/pages/admin/Finding/Finding'
import IFinding from 'src/models/finding'
import SimDocs from './columns/SimDocs/SimDocs'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'

const withColumns = (WrappedComponent: any) =>
  observer(({ ...rest }) => {
    const {
      findingStore,
      uiState: { modal },
    } = useRootStore()
    const searchString = rest?.params?.options?.fields?.searchString || ''

    useEffect(() => {
      findingStore.mutate = rest.findingsMutate
    }, [])

    const highlightedText = (text: any, query: any) => {
      if (query !== '' && text.includes(query)) {
        const parts = text.split(new RegExp(`(${query})`, 'gi'))

        return (
          <>
            {parts.map((part: any, index: any) =>
              part.toLowerCase() === query.toLowerCase() ? (
                <mark key={index}>{part}</mark>
              ) : (
                part
              )
            )}
          </>
        )
      }

      return text
    }

    const columns: AdminColumn[] = [
      {
        Header: 'id',
        accessor: 'visibleId',
        width: '72px',
        type: Type.String,
        Cell: (props: any) => {
          return highlightedText(props.value, searchString)
        },
      },
      {
        Header: 'Finding',
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
              {highlightedText(props.row.original.text, searchString)}
            </Box>
          )
        },
      },
      {
        Header: 'Severity',
        accessor: 'severity',
        type: Type.String,
        width: '72px',
        Cell: (props: any) => {
          const severityType = {
            0: 'Critical',
            1: 'Major',
            2: 'Minor',
          }
          const severity = props.row.original.severity as 0 | 1 | 2
          return (
            <Box
              sx={{
                lineHeight: '18px',
                width: '100%',
                whiteSpace: 'normal',
                overflowX: 'auto',
              }}
            >
              {highlightedText(severityType[severity], searchString)}
            </Box>
          )
        },
      },
      {
        Header: 'Domain',
        accessor: 'domainId',
        width: '200px',
        // type: Type.String,
        Cell: (cellProps: CellProps<IFinding>) => {
          const finding = cellProps.row.original
          if (finding.domainId === 'undefined' || !finding.domainId) {
            return <Box />
          }
          return (
            <Domain domainId={finding.domainId} searchString={searchString} />
          )
        },
      },

      // {
      //   Header: 'Status',
      //   accessor: 'status',
      //   type: Type.String,
      // },
      {
        Header: 'CFR',
        accessor: 'cfr',
        width: '168px',
        type: Type.String,
        Cell: (props: any) => {
          return highlightedText(props.value, searchString)
        },
      },
      {
        Header: 'ICH_GCP',
        accessor: 'ich_gcp',
        width: '168px',
        type: Type.String,
        Cell: (props: any) => {
          return highlightedText(props.value, searchString)
        },
      },
      {
        Header: 'Main Document',
        accessor: 'simDocId',
        width: '200px',
        // type: Type.String,
        Cell: (props: any) => {
          if (props.value === 'undefined' || !props.value) return <Box />
          return <SimDocs value={props.value} searchString={searchString} />
        },
      },
      {
        Header: 'Documents to compare with',
        accessor: 'simDocIds',
        width: '200px',
        // type: Type.String,
        Cell: (props: any) => {
          if (props.value === 'undefined' || !props.value) return <Box />
          return <SimDocs value={props.value} searchString={searchString} />
        },
      },
      {
        Header: 'Actions',
        Cell: CellButtons,
        storeKey: 'findingStore',
        mutateKey: 'findings',
        width: '168px',
        edit: (props) => {
          findingStore.form = props.row.original
          modal.open(
            'Findings',
            <Finding findingsMutate={rest.findingsMutate} />
          )
        },
      },
    ]

    const meta = {
      columns,
    }
    return <WrappedComponent {...rest} {...meta} />
  })

export default withColumns
