import * as FileSaver from 'file-saver'
import * as xlsx from 'xlsx'

import { Box, Button } from '@mui/material'

import BehaviorFilter from './BehaviorFilter/BehaviorFilter'
import InvoicedFilter from './InvoicedFilter/InvoicedFilter'
import MinEffortFilter from './MinEffortFilter/MinEffortFilter'
import PaginationTable from 'src/ui/components/PaginationTable'
import ResultFilter from './ResultFilter/ResultFilter'
import SearchBar from './SearchBar/SearchBar'
import SignOffFilter from './SignOffFilter/SignOffFilter'
import StatusFilter from './StatusFilter/StatusFilter'
import UserStatus from 'src/ui/core/components/tables/UserStatus/UserStatus'
import VerifiedFilter from './VerifiedFilter/VerifiedFilter'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useState } from 'react'
import { Authority } from 'src/models/user/types'

function UserStatusView(props: any) {
  const [filters, setFilters] = useState<{
    status: number
    result: number
    verified: number
    invoiced: number
    minEffort: number
    signOff: number
    behavior: number
  }>({
    status: 0,
    result: 0,
    verified: 0,
    invoiced: 0,
    minEffort: 0,
    signOff: 0,
    behavior: 0,
  })
  const [searchString, setSearchString] = useState<string>('')
  const authority = props.authorization as Authority
  console.log(props)
  console.log(authority)
  console.log(authority?.whitelist.map((_wl) => _wl.clientId))

  const onChangeSearchString = (e: any) => {
    setSearchString(e?.target?.value || '')
  }

  const onClickExport = async () => {
    try {
      const { data } = await axios.get(
        'v1/userAssessmentCycles/userStatusManagement/excel',
        {
          params: {
            filter: { isDeleted: false },
            options: {
              multi: true,
              fields: { ...filters },
            },
          },
        }
      )
      const wb = xlsx.read(data, {
        type: 'binary',
      })
      xlsx.writeFile(wb, 'userStatusManagement')
    } catch (e) {
      console.error(e)
    }
  }

  const onClickExportAll = async () => {
    try {
      const { data } = await axios.get(
        'v1/userAssessmentCycles/userStatusManagement/excel',
        {
          params: {
            filter: { isDeleted: false },
            options: {
              multi: true,
              fields: {
                status: 0,
                result: 0,
                verified: 0,
                invoiced: 0,
                minEffort: 0,
                signOff: 0,
                behavior: 0,
              },
            },
          },
        }
      )
      const wb = xlsx.read(data, {
        type: 'binary',
      })
      xlsx.writeFile(wb, 'userStatusManagement')
    } catch (e) {
      console.error(e)
    }
  }

  const getFilter = () => {
    const ret: any = {}
    switch (filters.status) {
      case 0: {
        break
      }
      case 1: {
        ret.status = 'Pending'
        break
      }
      case 2: {
        ret.status = 'Scoring'
        break
      }
      case 3: {
        ret.status = 'Complete'
        break
      }
      default: {
        break
      }
    }
    switch (filters.result) {
      case 0: {
        break
      }
      case 1: {
        ret.grade = 'Pass I'
        break
      }
      case 2: {
        ret.grade = 'Pass II'
        break
      }
      case 3: {
        ret.grade = 'Pass With Notice I'
        break
      }
      case 4: {
        ret.grade = 'Pass With Notice II'
        break
      }
      default: {
        break
      }
    }
    switch (filters.verified) {
      case 0: {
        break
      }
      case 1: {
        ret.verified = true
        break
      }
      case 2: {
        ret.verified = false
        break
      }
      default: {
        break
      }
    }
    switch (filters.invoiced) {
      case 0: {
        break
      }
      case 1: {
        ret.invoiced = true
        break
      }
      case 2: {
        ret.invoiced = false
        break
      }
      default: {
        break
      }
    }
    switch (filters.minEffort) {
      case 0: {
        break
      }
      case 1: {
        ret.minimumEffort = true
        break
      }
      case 2: {
        ret.minimumEffort = false
        break
      }
      default: {
        break
      }
    }
    switch (filters.signOff) {
      case 0: {
        break
      }
      case 1: {
        ret.signedOff = true
        break
      }
      case 2: {
        ret.signedOff = false
        break
      }
      case 3: {
        ret.signedOff = false
        ret.signedOffDate = { $ne: null }
        break
      }
      default: {
        break
      }
    }
    switch (filters.behavior) {
      case 0: {
        break
      }
      case 1: {
        ret.collaborated = true
        break
      }
      case 2: {
        ret.collaborated = false
        break
      }
      default: {
        break
      }
    }
    return ret
  }

  const searchStringFilter = {
    $or: [
      { 'user.profile.firstName': { $regex: searchString, $options: 'i' } },
      { 'user.profile.lastName': { $regex: searchString, $options: 'i' } },
      { 'clientUnit.name': { $regex: searchString, $options: 'i' } },
      { 'user.email': { $regex: searchString, $options: 'i' } },
      { grade: { $regex: searchString, $options: 'i' } },
    ],
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          top: 0,
          zIndex: 100,
          bgcolor: 'rgb(242, 243, 243)',
          width: '100%',
          pt: 1.5,
        }}
      >
        <SearchBar
          searchString={searchString}
          onChange={onChangeSearchString}
        />
        <Box
          sx={{
            // position: 'absolute',
            display: 'flex',
            // top: '19px',
            // left: '272px',
          }}
        >
          <Box>
            {/* all, pending, scoring, complete */}
            <StatusFilter
              selectedOption={filters.status}
              handleChangeSelectedOption={(e: any) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            />
          </Box>
          <Box>
            {/* all, pass i, pass ii, pass with notice i, pass with notice ii */}
            <ResultFilter
              selectedOption={filters.result}
              handleChangeSelectedOption={(e: any) =>
                setFilters((prev) => ({ ...prev, result: e.target.value }))
              }
            />
          </Box>
          <Box>
            {/* all, verified, not verified */}
            <VerifiedFilter
              selectedOption={filters.verified}
              handleChangeSelectedOption={(e: any) =>
                setFilters((prev) => ({ ...prev, verified: e.target.value }))
              }
            />
          </Box>
          <Box>
            {/* all, invoiced, not invoiced */}
            <InvoicedFilter
              selectedOption={filters.invoiced}
              handleChangeSelectedOption={(e: any) =>
                setFilters((prev) => ({ ...prev, invoiced: e.target.value }))
              }
            />
          </Box>
          <Box>
            {/* all, minimum effort, not minimum effort */}
            <MinEffortFilter
              selectedOption={filters.minEffort}
              handleChangeSelectedOption={(e: any) =>
                setFilters((prev) => ({ ...prev, minEffort: e.target.value }))
              }
            />
          </Box>
          <Box>
            {/* all, sign off, not sign off, ready to be sign off */}
            <SignOffFilter
              selectedOption={filters.signOff}
              handleChangeSelectedOption={(e: any) =>
                setFilters((prev) => ({ ...prev, signOff: e.target.value }))
              }
            />
          </Box>
          <Box>
            {/* all, unusual behavior */}
            <BehaviorFilter
              selectedOption={filters.behavior}
              handleChangeSelectedOption={(e: any) =>
                setFilters((prev) => ({ ...prev, behavior: e.target.value }))
              }
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              sx={{ ml: 1 }}
              size="small"
              onClick={onClickExport}
            >
              Export
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 1 }}
              size="small"
              onClick={onClickExportAll}
            >
              Export All
            </Button>
          </Box>
        </Box>
      </Box>

      <PaginationTable
        collectionName="userStatusManagement"
        params={{
          filter: {
            isDeleted: false,
            clientUnitId: {
              $in: authority?.whitelist.map((_wl) => _wl.clientId),
            },
            // clientUnitId: '643d8a5b9a8995fdcd7e6a03',
            businessUnitId: {
              $in: authority?.whitelist.reduce((acc, cur) => {
                return [...acc, ...cur.businessUnits]
              }, [] as string[]),
            },
            'user.role.priority': 6,
            ...searchStringFilter,
            ...getFilter(),
          },
          options: {
            multi: true,
            fields: { ...filters },
            authority: authority,
          },
        }}
        searchString={searchString}
        Table={UserStatus}
        version={3}
        height={'calc(100vh - 280px)'}
      />
    </Box>
  )
}
export default observer(UserStatusView)
