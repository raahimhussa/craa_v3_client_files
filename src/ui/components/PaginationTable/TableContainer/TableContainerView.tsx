import { Box } from '@mui/material'
import FindingsTable from 'src/ui/core/components/tables/Findings/Findings'
import Loading from '@components/Loading/Loading'
import _ from 'lodash'
import { observer } from 'mobx-react'

type Props = {
  Table: React.ComponentType
} & any

function TableContainerView({ Table, ...rest }: Props) {
  const data = rest[rest.collectionName]

  if (data) return <Table {...rest} data={data} />
  return (
    <Box>
      <Loading />
    </Box>
  )
}
export default observer(TableContainerView)
