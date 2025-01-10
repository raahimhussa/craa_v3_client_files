import { Box } from '@mui/material'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimManagementFilter from './SimManagementFilter/SimManagementFilter'
import SimManagementTable from '@components/tables/SimManagement/SimManagement'
import _ from 'lodash'
import { observer } from 'mobx-react'
import { useState } from 'react'
import { Authority } from 'src/models/user/types'
// @ts-ignore

// Interface만들어야 합니다.
type Prop = {
  userSimulations: any[]
  authorization: Authority
}

function SimManagementView(props: Prop) {
  const [filter, setFilter] = useState<any>({})
  const [options, setOptions] = useState<any>({})
  const [searchString, setSearchString] = useState<string>('')

  const authority = props.authorization

  const handleFilter = (filter: any, options: any) => {
    setFilter(filter)
    setOptions(options)
  }

  const onChangeSearchString = (e: any) => {
    setSearchString(e?.target?.value || '')
  }

  const searchStringFilter = () => {
    return {
      $or: [
        { 'clientUnit.name': { $regex: searchString, $options: 'i' } },
        {
          'user.profile.firstName': {
            $regex: searchString,
            $options: 'i',
          },
        },
        {
          'user.profile.lastName': {
            $regex: searchString,
            $options: 'i',
          },
        },
        {
          'userBaseline.simulation.name': {
            $regex: searchString,
            $options: 'i',
          },
        },
        {
          'userBaseline.status': { $regex: searchString, $options: 'i' },
        },
        {
          status: { $regex: searchString, $options: 'i' },
        },
      ],
    }
  }

  return (
    <>
      <SimManagementFilter
        handleFilter={handleFilter}
        searchString={searchString}
        onChangeSearchString={onChangeSearchString}
        appliedFilter={{ filter, options }}
      />
      <PaginationTable
        collectionName={'simManagement'}
        Table={SimManagementTable}
        params={{
          filter: {
            ...filter,
            ...searchStringFilter(),
            clientUnitId: {
              $in: authority?.whitelist.map((_wl) => _wl.clientId),
            },
            // clientUnitId: '643d8a5b9a8995fdcd7e6a03',
            businessUnitId: {
              $in: authority?.whitelist.reduce((acc, cur) => {
                return [...acc, ...cur.businessUnits]
              }, [] as string[]),
            },
          },
          options,
        }}
        searchString={searchString}
        version={3}
      />
    </>
  )
}
export default observer(SimManagementView)
