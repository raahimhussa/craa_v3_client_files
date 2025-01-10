import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import Domain from 'src/models/domain'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  scoresByMainDomain: {
    domainName: string
    identifiedPercent: string
  }[]
}

const DomainsView = ({ scoresByMainDomain }: Props) => {
  return (
    <Table sx={{ width: 'max-content' }} id={'datadump-domains-table'}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ minWidth: '376px' }} className="datadump-head-cell">
            Domain
          </TableCell>
          <TableCell
            // sx={{ minWidth: '256px' }}
            className="datadump-head-cell"
            align={'center'}
          >
            Mean % Identified
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {scoresByMainDomain.map((byDomain) => (
          <TableRow>
            <TableCell className="datadump-body-cell">
              {byDomain.domainName}
            </TableCell>
            <TableCell className="datadump-body-cell" align="center">
              {byDomain.identifiedPercent}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default observer(DomainsView)
