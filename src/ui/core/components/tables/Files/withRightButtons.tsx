import { AdminButton } from 'src/ui/core/components/DataGrid/DataGrid'
import { WrappingFunction } from '@shopify/react-compose'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import Swal from 'sweetalert2'
const withRightButtons: WrappingFunction = (WrappedComponent) => observer((props) => {
  const { state } = props
  const { fileStore, uiState: { files } } = useRootStore()
  const onClickDelete = async () => {
    const selectedRowIds = toJS(state.selectedRowIds)

    if (selectedRowIds.length === 0) {
      return Swal.fire({ title: 'info', text: "Select row", icon: 'warning' })
    }

    const params = {
      filter: {
        _id: {
          $in: selectedRowIds,
        },
      },
      update: {
        isDeleted: true,
      },
    }
    try {
      await fileStore.repository.update(params)
    } catch (error) {
      return Swal.fire({
        title: 'Error!',
        icon: 'error'
      })
    }

    files.mutate && files.mutate()

    state.selectedRowIds = []
  }

  const rightButtons: AdminButton[] = [
    {
      title: 'Delete',
      onClick: onClickDelete,
      color: 'error',
    },
  ]
  return <WrappedComponent {...props} rightButtons={rightButtons} />
})

export default withRightButtons
