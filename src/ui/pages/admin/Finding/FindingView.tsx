import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  InputLabel,
  Stack,
} from '@mui/material'
import IFinding, { FindingSeverity } from 'src/models/finding/finding.interface'

import Autocomplete from 'src/ui/core/components/mui/inputs/Autocomplete/Autocomplete'
import Card from '@mui/material/Card'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import IDomain from 'src/models/domain/domain.interface'
import IKeyConcept from 'src/models/keyConcept/keyconcept.interface'
import { ISimDoc } from 'src/models/simDoc/types'
import { KeyedMutator } from 'swr'
import Select from 'src/ui/core/components/mui/inputs/Select/Select'
import Swal from 'sweetalert2'
import { TextField } from 'src/ui/core/components'
import _ from 'lodash'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import { withFind } from '@hocs'
import withFindOne from 'src/hocs/withFindOne'
import withStore from 'src/hocs/withStore'

const FindingView = observer((props: any) => {
  const {
    keyConcepts,
    simDocs,
    domains,
    finding,
    findingsMutate,
  }: {
    keyConcepts: IKeyConcept[]
    simDocs: ISimDoc[]
    finding: IFinding
    domains: IDomain[]
    findingsMutate: KeyedMutator<any>
  } = props
  const { findingStore } = useRootStore()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (finding) {
      findingStore.form = finding
    }
    return () => {
      findingStore.resetForm()
    }
  }, [finding?._id])

  const keyConceptOptions = keyConcepts
    .filter((keyConcept) => {
      const selectedDomain = domains.find(
        (domain) => domain._id === findingStore.form.domainId
      )
      if (
        keyConcept.domainId === selectedDomain?._id ||
        keyConcept.domainId === selectedDomain?.parentId
      )
        return true
      return false
    })
    .map((keyConcept) => {
      return {
        text: keyConcept.description,
        value: keyConcept._id,
      }
    })

  const simDocOptions = simDocs.map((simDoc) => {
    return {
      text: simDoc.title,
      value: simDoc._id,
    }
  })

  const severityOptions = [
    {
      text: 'Critical',
      value: FindingSeverity.Critical,
    },
    {
      text: 'Major',
      value: FindingSeverity.Major,
    },
    {
      text: 'Minor',
      value: FindingSeverity.Minor,
    },
  ]

  const domainOptions = domains
    .filter((domain) => {
      if (domain.visibleId === '2') return false
      return domain.visibleId ? true : false
    })
    .sort((a, b) => a.seq - b.seq)
    .map((domain) => ({
      text: domain.name,
      value: domain._id,
    }))

  return (
    <DetailLayout store={findingStore} mutate={findingsMutate}>
      <Box sx={{ bgcolor: 'rgb(242, 243, 243)' }}>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={12} md={6} lg={6}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              <CardContent>
                <Stack spacing={1}>
                  <InputLabel>ID</InputLabel>
                  <TextField
                    label="id"
                    state={findingStore}
                    path="form.visibleId"
                    fullWidth
                    size="small"
                    variant="outlined"
                  />
                  <InputLabel>Finding</InputLabel>
                  <Box className="multiline">
                    <TextField
                      label="finding"
                      state={findingStore}
                      path="form.text"
                      fullWidth
                      multiline
                      rows={4}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    // label="severity"
                    state={findingStore}
                    path="form.severity"
                    options={severityOptions}
                  />
                  <InputLabel>Domain</InputLabel>
                  <Select
                    // label="domain"
                    state={findingStore}
                    path="form.domainId"
                    options={domainOptions}
                  />
                  <InputLabel>KeyConcept</InputLabel>
                  <Select
                    // label="keyConcept"
                    state={findingStore}
                    path="form.keyConceptId"
                    options={keyConceptOptions}
                  />
                  <Stack direction={'row'} spacing={2}>
                    <Box sx={{ width: '50%' }}>
                      <InputLabel>ICH_GCP</InputLabel>
                      <TextField
                        label="ich_gcp"
                        state={findingStore}
                        path="form.ich_gcp"
                        fullWidth
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <InputLabel>CFR</InputLabel>
                      <TextField
                        label="cfr"
                        fullWidth
                        size="small"
                        state={findingStore}
                        path="form.cfr"
                        variant="outlined"
                      />
                    </Box>
                  </Stack>
                  <InputLabel>Main Document</InputLabel>
                  <Select
                    // label="main document"
                    disabled={props.addFinding}
                    state={findingStore}
                    path="form.simDocId"
                    options={simDocOptions}
                  />
                  <InputLabel>Documents To Compare With</InputLabel>
                  <Autocomplete
                    // label={'documents to compare with'}
                    limitTags={3}
                    max={2}
                    maxErrorMessage={'Too many compare simDocs'}
                    state={findingStore}
                    path="form.simDocIds"
                    options={simDocOptions}
                    className="d"
                  />
                  <Alert>
                    <AlertTitle>Fill in all fields.</AlertTitle>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DetailLayout>
  )
})

export default compose<any>(
  withStore('findingStore'),
  withFindOne({
    isDocNeeded: false,
    collectionName: 'findings',
    version: 2,
    getFilter: (props: any) => {
      const filter = { isDeleted: false } as any
      if (props.findingStore?.selectedSimDoc?._id) {
        filter.simDocId = props.findingStore?.selectedSimDoc?._id
      }
      if (props.isNew) {
        filter._id = 'nothing to find'
      } else if (props.findingStore?.form._id) {
        filter._id = props.findingStore?.form._id
      }
      return filter
    },
  }),
  withFind({
    collectionName: 'keyConcepts',
    getFilter: () => ({
      isDeleted: false,
    }),
    version: 2,
  })
)(FindingView)
