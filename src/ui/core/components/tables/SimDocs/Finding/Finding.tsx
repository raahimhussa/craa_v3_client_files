import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  Stack,
} from '@mui/material'
import IFinding, { FindingSeverity } from 'src/models/finding/finding.interface'

import Autocomplete from 'src/ui/core/components/mui/inputs/Autocomplete/Autocomplete'
import Card from '@mui/material/Card'
import DocumentFindings from '@components/tables/DocumentFindings/DocumentFindings'
import { DocumentType } from 'src/utils/status'
import FileSelect from '@components/FileSelect/FileSelect'
import IDomain from 'src/models/domain/domain.interface'
import IKeyConcept from 'src/models/keyConcept/keyconcept.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import { KeyedMutator } from 'swr'
import RescueMedication from './RescueMedication/RescueMedication'
import SelectedDocument from './SelectedDocument/SelectedDocument'
import StudyMedication from './StudyMedication/StudyMedication'
import _ from 'lodash'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useState } from 'react'
import { withFind } from '@hocs'
import withStore from 'src/hocs/withStore'

const FindingView = observer((props: any) => {
  const {
    simDocs,
    domains,
    finding,
    findings,
    findingsMutate,
  }: {
    simDocs: ISimDoc[]
    finding: IFinding
    findings: IFinding[]
    domains: IDomain[]
    findingsMutate: KeyedMutator<any>
  } = props
  const { findingStore, simDocStore } = useRootStore()
  const [documentType, setDocumentType] = useState<DocumentType>(
    DocumentType.Document
  )
  // const findingOptions = findings.map((_finding) => ({
  //   text: _finding.text,
  //   value: _finding._id,
  // }))

  // const simDocOptions = simDocs.map((simDoc) => {
  //   return {
  //     text: simDoc.title,
  //     value: simDoc._id,
  //   }
  // })
  if (!findingStore.selectedSimDoc) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            <AlertTitle>Select Document in Folder</AlertTitle>
          </Alert>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader title={`${findingStore.selectedSimDoc.title}`} />
      <Box
        sx={{ marginLeft: '24px', marginTop: '18px', marginBottom: '-64px' }}
      >
        <Select
          label="Document type"
          value={findingStore.selectedSimDoc.kind}
          onChange={async (e) => {
            if (!findingStore.selectedSimDoc) return
            findingStore.selectedSimDoc.kind = e.target.value as DocumentType
            setDocumentType(e.target.value as DocumentType)
            const simDocId = findingStore.selectedSimDoc._id
            const update = { ...findingStore.selectedSimDoc, store: undefined }
            simDocStore.update(simDocId, update)
          }}
          variant="standard"
        >
          <MenuItem value={DocumentType.Document}>Document</MenuItem>
          <MenuItem value={DocumentType.StudyMedication}>
            Study Medication
          </MenuItem>
          <MenuItem value={DocumentType.RescueMedication}>
            Rescue Medication
          </MenuItem>
        </Select>
      </Box>
      <CardContent>
        {/* <FileSelect simDocId={findingStore.selectedSimDoc?._id} /> */}
        {findingStore.selectedSimDoc?.kind === DocumentType.Document ? (
          <>
            <SelectedDocument simDocId={findingStore.selectedSimDoc?._id} />
            <DocumentFindings
              findings={findings}
              simDocId={findingStore.selectedSimDoc?._id}
              findingsMutate={findingsMutate}
            />
          </>
        ) : null}
        {findingStore.selectedSimDoc?.kind === DocumentType.StudyMedication ? (
          <>
            <StudyMedication />
          </>
        ) : null}
        {findingStore.selectedSimDoc?.kind === DocumentType.RescueMedication ? (
          <>
            <RescueMedication />
          </>
        ) : null}
      </CardContent>
    </Card>
  )
})

export default compose<any>(
  withStore('findingStore'),
  withFind({
    collectionName: 'findings',
    version: 2,
    getFilter: (props: any) => {
      let filter = { simDocId: 'nothing to find', isDeleted: false }
      if (props.findingStore?.selectedSimDoc?._id) {
        filter = {
          simDocId: props.findingStore?.selectedSimDoc?._id,
          isDeleted: false,
        }
      }
      return filter
    },
  })
)(FindingView)
