import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { DocKind } from './SimDocs'
import Instructions from 'src/ui/core/components/tables/Instructions/Instructions'
import Protocol from '../modals/Protocol/Protocol'
import ProtocolView from '../modals/Protocol/ProtocolView'
import Protocols from 'src/ui/core/components/tables/Protocols/Protocols'
import SimDocs from 'src/ui/core/components/tables/SimDocs/SimDocs'
import StudyDocuments from 'src/ui/core/components/tables/StudyDocuments/StudyDocuments'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'

function SimDocsView({ simDocs, simDocsMutate, docs }: any) {
  const { findingStore } = useRootStore()
  const [value, setValue] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  useEffect(() => {
    findingStore.resetForm()
  }, [])

  const instructions = docs.filter(
    (doc: any) => doc.kind === DocKind.Instruction
  )
  const studyDocuments = docs.filter(
    (doc: any) => doc.kind === DocKind.StudyDocument
  )
  const protocols = docs.filter((doc: any) => doc.kind === DocKind.Protocol)

  return (
    <Box>
      <Tabs
        variant="fullWidth"
        indicatorColor={'primary'}
        textColor="primary"
        sx={{ mb: 2, boxShadow: 2 }}
        onChange={handleChange}
        value={value}
        aria-label="Tabs where each tab needs to be selected manually"
      >
        <Tab
          label="Document Managment"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
        <Tab
          label="Protocol Managment"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
        <Tab
          label="Instruction Managment"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
        <Tab
          label="Study Documents Managment"
          sx={{ fontSize: 12, fontWeight: 600 }}
        />
      </Tabs>
      {value === 0 && (
        <SimDocs simDocs={simDocs} simDocsMutate={simDocsMutate} />
      )}
      {value === 1 && <Protocols protocols={protocols} />}
      {value === 2 && <Instructions instructions={instructions} />}
      {value === 3 && <StudyDocuments studyDocuments={studyDocuments} />}
    </Box>
  )
}
export default observer(SimDocsView)
