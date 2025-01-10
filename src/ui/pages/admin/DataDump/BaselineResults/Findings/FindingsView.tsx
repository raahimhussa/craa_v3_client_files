import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { green, yellow } from '@mui/material/colors'

import Domain from 'src/models/domain'
import Finding from 'src/models/finding'
import User from 'src/models/user'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  identifiedFindingsByUser: {
    findingVisibleId: string
    findingText: string
    severity: string
    domainName: string
    users: string[]
    identifiedCount: string
    identifiedPercent: string
  }[]
  users: User[]
}

const FindingsView = ({ identifiedFindingsByUser, users }: Props) => {
  const columns = () => {
    const _columns: { name: string; styles?: any }[] = [
      {
        name: 'Finding Id',
      },
      {
        name: 'Finding',
        styles: {
          minWidth: '460px',
        },
      },
      {
        name: 'Severity',
      },
      {
        name: 'Domain',
        styles: {
          minWidth: '128px',
        },
      },
    ]
    users.forEach((user) => {
      _columns.push({ name: user.name, styles: { minWidth: '70px' } })
    })
    _columns.push({ name: 'Count Identified' })
    _columns.push({ name: '% Identified' })
    return _columns
  }
  return (
    <Table sx={{ width: 'max-content' }} id={'datadump-findings-table'}>
      <TableHead>
        <TableRow>
          {columns().map((col) => {
            return (
              <TableCell
                sx={{ ...col.styles }}
                className="datadump-head-cell"
                align={'center'}
              >
                {col.name}
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {identifiedFindingsByUser?.map((byUser) => {
          return (
            <TableRow>
              <TableCell className="datadump-body-cell" align={'center'}>
                {byUser.findingVisibleId}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {byUser.findingText}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {byUser.severity}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {byUser.domainName}
              </TableCell>
              {byUser.users.map((isIdentified) => (
                <TableCell
                  className="datadump-body-cell"
                  sx={{
                    background:
                      isIdentified === 'identified' ? green[500] : yellow[500],
                  }}
                  align={'center'}
                >
                  {isIdentified}
                </TableCell>
              ))}

              <TableCell className="datadump-body-cell" align={'center'}>
                {byUser.identifiedCount}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {byUser.identifiedPercent}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default observer(FindingsView)
