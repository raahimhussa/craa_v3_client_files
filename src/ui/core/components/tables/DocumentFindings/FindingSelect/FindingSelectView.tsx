import { Divider, Typography } from '@mui/material'
import { observer, useLocalObservable } from 'mobx-react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import File from 'src/models/file'
import Files from 'src/ui/core/components/tables/Files/Files'
import Finding from 'src/models/finding'
import Findings from '@components/tables/Findings/Findings'
import PaginationTable from 'src/ui/components/PaginationTable'
import SearchBar from './SearchBar/SearchBar'
import SimDoc from 'src/models/simDoc'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import axios from 'axios'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

type Props = {
  simDocId: string
  findingsMutate: any
}

function FindingSelectView(props: Props) {
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined)
  const [searchString, setSearchString] = useState<string>('')

  const {
    uiState: { modal },
    findingStore,
  } = useRootStore()
  const localState = useLocalObservable(() => ({
    selectedRowIds: [],
  }))

  const onClickSelect = async () => {
    const filter = {
      _id: { $in: localState.selectedRowIds },
    } as any
    const update = {
      simDocId: props.simDocId,
    } as any
    await axios.patch('v2/findings', {
      filter,
      update,
    })
    props.findingsMutate && (await props.findingsMutate())
    findingStore.mutate && (await findingStore.mutate())
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: 'white' }}>
      <Box sx={{ width: '100%' }}>
        <Button variant="contained" fullWidth onClick={onClickSelect}>
          Select
        </Button>
        <Box sx={{ height: 1048, overflow: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              backgroundColor: 'white',
              position: 'absolute',
              // transform: 'translate(-50%, 0%)',
              mt: 2,
              zIndex: 100,
            }}
          >
            <Box sx={{ width: 32, height: 32, backgroundColor: 'white' }} />
            <SearchBar
              searchString={searchString}
              onChange={(e: any) => setSearchString(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              backgroundColor: 'white',
              position: 'absolute',
              left: '50%',
              transform: 'translate(-50%, 0%)',
              mt: 2,
              zIndex: 100,
            }}
          >
            <SimulationSelect
              setSelectedSimulationId={setSelectedSimulationId}
            />
          </Box>
          <PaginationTable
            collectionName={'findings'}
            Table={Findings}
            params={{
              filter: { isDeleted: false },
              options: { fields: { selectedSimulationId, searchString } },
            }}
            state={localState}
            version={2}
            buttons={false}
          />
        </Box>
      </Box>
    </Box>
  )
}
export default observer(FindingSelectView)
