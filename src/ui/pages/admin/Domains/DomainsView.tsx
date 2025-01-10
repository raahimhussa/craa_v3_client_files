import Domains from 'src/ui/core/components/tables/Domains/Domains'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
function DomainsView({ domains, domainsMutate, isSub, parentId }: any) {
  return (
    <Domains
      isSub={isSub}
      parentId={parentId ? parentId : null}
      // buttons={false}
      domains={domains}
      domainsMutate={domainsMutate}
    />
  )
}
export default observer(DomainsView)
