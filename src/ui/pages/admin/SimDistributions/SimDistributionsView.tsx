import PaginationTable from 'src/ui/components/PaginationTable'
import SimDistributions from '@components/tables/SimDistributions/SimDistributions'
import { UserSimulationStatus } from 'src/utils/status'
import { observer } from 'mobx-react'
function SimDistributionsView({ userSimulations }: any) {
  return (
    <>
      <PaginationTable
        collectionName="userSimulations"
        Table={SimDistributions}
        version={2}
        params={{
          filter: { isDeleted: false, status: UserSimulationStatus.Published },
        }}
      />
      <PaginationTable
        collectionName="userSimulations"
        Table={SimDistributions}
        version={2}
        params={{
          filter: {
            isDeleted: false,
            status: UserSimulationStatus.Distributed,
          },
        }}
      />
    </>
  )
  // NOTE - 같은 페이지에 pagination table 1개 더 (status === UserSimulationStatus.Distributed)
  // return <SimDistributions userSimulations={userSimulations} />
}
export default observer(SimDistributionsView)
