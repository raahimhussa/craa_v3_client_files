import { Box, useTheme } from '@mui/material'

import Assessment from '../Assessment'
import { AssessmentStatus } from 'src/utils/status'
import CompleteAdjudications from '@components/tables/Adjudications/complete/Adjudications'
import InProgressAdjudications from '@components/tables/Adjudications/inProgress/Adjudications'
import PaginationTable from 'src/ui/components/PaginationTable'
import { observer } from 'mobx-react'
import { useUser } from '@hooks'

// assessmentId 필요
function AdjudicationsView(props: any) {
  const { data } = useUser()
  return (
    <>
      <PaginationTable
        collectionName="assessments"
        Table={InProgressAdjudications}
        version={2}
        params={{
          filter: {
            isDeleted: false,
            'adjudicator._id': data._id,
            'adjudicator.status': {
              $in: [AssessmentStatus.InProgress, AssessmentStatus.Pending],
            },
          },
        }}
      />
      <PaginationTable
        collectionName="assessments"
        Table={CompleteAdjudications}
        version={2}
        params={{
          filter: {
            isDeleted: false,
            'adjudicator._id': data._id,
            'adjudicator.status': AssessmentStatus.Complete,
          },
        }}
      />
    </>
  )
}

export default observer(AdjudicationsView)
