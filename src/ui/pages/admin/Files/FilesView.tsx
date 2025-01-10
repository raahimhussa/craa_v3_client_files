import { observer, useLocalObservable } from 'mobx-react'

import { Box } from '@mui/material'
import Files from 'src/ui/core/components/tables/Files/Files'
import PaginationTable from 'src/ui/components/PaginationTable'
import SimulationSelect from './SimulationSelect/SimulationSelect'
import { useState } from 'react'

function FilesView() {
  const [selectedSimulationId, setSelectedSimulationId] = useState<
    string | undefined
  >(undefined)
  return (
    <>
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
        <SimulationSelect setSelectedSimulationId={setSelectedSimulationId} />
      </Box>
      <PaginationTable
        collectionName="files"
        Table={Files}
        version={1}
        params={{
          filter: { mimeType: 'application/pdf', isDeleted: false },
          options: { fields: { selectedSimulationId } },
        }}
      />
    </>
  )
}
export default observer(FilesView)
