import { Box, TextField } from 'src/ui/core/components'

import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

function DomainView() {
  const {
    domainStore,
    uiState: { domains },
  } = useRootStore()
  return (
    <DetailLayout mutate={domains.mutate} store={domainStore}>
      <Box sx={{ p: 2, bgcolor: 'white' }}>
        <Box sx={{ marginBottom: '24px', maxWidth: '720px', width: '100%' }}>
          <TextField
            label="ID"
            placeholder="ID"
            state={domainStore}
            path="form.visibleId"
          />
        </Box>
        <Box sx={{ marginBottom: '24px', maxWidth: '720px', width: '100%' }}>
          <TextField
            label="Number"
            placeholder="Number"
            state={domainStore}
            path="form.seq"
          />
        </Box>
        <Box sx={{ maxWidth: '720px', width: '100%' }}>
          <TextField
            label="Domain Name"
            placeholder="Domain Name"
            state={domainStore}
            path="form.name"
          />
        </Box>
      </Box>
    </DetailLayout>
  )
}
export default observer(DomainView)
