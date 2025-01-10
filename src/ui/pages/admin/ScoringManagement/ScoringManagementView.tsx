import { AssessmentStatus } from 'src/utils/status'
import CompleteScoringManagementTable from '@components/tables/ScoringManagement/complete/ScoringManagement'
import InProgressScoringManagementTable from '@components/tables/ScoringManagement/inProgress/ScoringManagement'
import PaginationTable from 'src/ui/components/PaginationTable'
import { observer } from 'mobx-react'

function ScoringManagementView() {
  return (
    <>
      <PaginationTable
        collectionName={'scoringManagement'}
        Table={InProgressScoringManagementTable}
        version={3}
        params={{
          filter: {
            status: AssessmentStatus.InProgress,
            isDeleted: false,
          },
        }}
      />
      <PaginationTable
        collectionName={'scoringManagement'}
        Table={CompleteScoringManagementTable}
        version={3}
        params={{
          filter: { status: AssessmentStatus.Complete, isDeleted: false },
        }}
      />
    </>
  )
}
export default observer(ScoringManagementView)
