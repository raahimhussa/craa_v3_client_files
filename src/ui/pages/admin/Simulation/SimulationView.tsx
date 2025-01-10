import {
  Autocomplete,
  Grid,
  Stack,
  TextField,
  Typography,
} from 'src/ui/core/components'
import {
  Box,
  CardContent,
  CardHeader,
  Divider,
  InputLabel,
  Tab,
  Tabs,
} from '@mui/material'
import {
  SimulationAnnouncementTemplateType,
  TemplateStatus,
} from 'src/utils/status'

import { AgreementEditor } from './AgreementEditor'
import Card from '@mui/material/Card'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import Editor from '@components/Editor/Editor'
import IFolder from 'src/models/folder/folder.interface'
import SimulationAnnouncementTemplate from 'src/models/simulationAnnouncementTemplate'
import { SubmissionEditor } from './SubmissionEditor'
import axios from 'axios'
import { observer } from 'mobx-react'
import simulationAnnouncementTemplate from 'src/models/simulationAnnouncementTemplate'
import { toJS } from 'mobx'
import { useRootStore } from 'src/stores'
import { useState } from 'react'

function SimulationView(props: any) {
  const { folders } = props
  const {
    simulationStore,
    uiState: { simulations },
  } = useRootStore()
  const [tabIndex, setTabIndex] = useState<number>(0)
  const folderOptions = folders.map((folder: IFolder) => {
    return {
      text: folder.name,
      value: folder._id,
    }
  })

  const onChangeTab = (e: any, changedTabIndex: number) => {
    setTabIndex(changedTabIndex)
  }

  const selectedFolders = folders?.filter((folder: any) =>
    simulationStore.form.folderIds?.includes(folder._id)
  )

  return (
    <DetailLayout store={simulationStore} mutate={simulations.mutate}>
      <Box sx={{ bgcolor: 'rgb(242, 243, 243)' }}>
        <Grid container sx={{ p: 2 }}>
          <Grid item xs={6}>
            <Card className="paper-grid" sx={{ p: 0, mr: 2 }}>
              {/* <CardHeader title="Info" /> */}
              <CardContent>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 2,
                    rowGap: 2,
                    gridTemplateColumns: {
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(1, 1fr)',
                      md: 'repeat(2, 1fr)',
                    },
                  }}
                >
                  <div>
                    <InputLabel sx={{ mb: 1 }}>Name</InputLabel>
                    <TextField
                      size="small"
                      state={simulationStore}
                      path="form.name"
                      placeholder="Name"
                      variant="outlined"
                    />
                  </div>
                  <div>
                    <InputLabel sx={{ mb: 1 }}>Label</InputLabel>
                    <TextField
                      size="small"
                      state={simulationStore}
                      path="form.label"
                      placeholder="Label"
                      variant="outlined"
                    />
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="paper-grid" sx={{ p: 0 }}>
              {/* <CardHeader title="Document" /> */}
              <CardContent>
                {/* <Typography variant="body1">Document Select</Typography> */}
                <InputLabel sx={{ mb: 1 }}>Document Select</InputLabel>
                <Autocomplete
                  options={folderOptions}
                  state={simulationStore}
                  path="form.folderIds"
                  className="ioii"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card className="paper-grid" sx={{ p: 0, mt: 3 }}>
              <CardContent>
                <Tabs value={tabIndex} onChange={onChangeTab}>
                  <Tab
                    value={0}
                    label={'Agreement'}
                    id={'simulation-field-id-0'}
                  />
                  <Tab
                    value={1}
                    label={'Submission'}
                    id={'simulation-field-id-1'}
                  />
                </Tabs>
                <Divider />
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Box sx={{ flex: 5 }}>
                    {tabIndex === 0 ? (
                      <AgreementEditor
                        state={simulationStore}
                        path={`form.agreement`}
                        mutate={simulations.mutate}
                      />
                    ) : null}
                    {tabIndex === 1 ? (
                      <SubmissionEditor
                        state={simulationStore}
                        path={`form.onSubmission`}
                        mutate={simulations.mutate}
                      />
                    ) : null}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DetailLayout>
  )
}
export default observer(SimulationView)
