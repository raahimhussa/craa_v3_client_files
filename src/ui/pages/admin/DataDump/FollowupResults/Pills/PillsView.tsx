import { Stack, Table, TableCell, TableHead, TableRow } from '@mui/material'

import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {}

const PillsView = () => {
  return (
    <Table sx={{ width: 'max-content' }} id={'datadump-pills-table'}>
      <TableHead>
        <TableRow>
          <TableCell
            sx={{ minWidth: '196px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            Description
          </TableCell>
          <TableCell
            sx={{ minWidth: '320px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            Subject JHM Study Med Returned - Visit 3
          </TableCell>
          <TableCell
            sx={{ minWidth: '320px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            Subject JHM Study Med Returned - Visit 4
          </TableCell>
          <TableCell
            sx={{ minWidth: '320px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            Subject JHM Study Med Returned - Visit 13-ET
          </TableCell>
          <TableCell
            sx={{ minWidth: '196px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            Total
          </TableCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}

export default observer(PillsView)
