import { WrappingFunction } from '@shopify/react-compose'
// import { Alert } from '@utils'
// import axios from 'axios'
// import { toJS } from 'mobx'
import { observer } from 'mobx-react'
// import { useRootStore } from 'src/stores'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    // const { state, studyDocumentsMutate, studyDocuments } = props
    // const { dialogStore } = useRootStore()
    const rightButtons: any = [
      // {
      //   title: 'Delete',
      //   onClick: async () => {
      //     const selectedRowIds = toJS(state.selectedRowIds)
      //     const data = {
      //       filter: {
      //         _id: {
      //           $in: selectedRowIds,
      //         },
      //       },
      //       update: {
      //         isDeleted: true,
      //       },
      //     }
      //     try {
      //       await axios.patch('v1/studyDocuments', data)
      //     } catch (error) {
      //       Alert.handle(error)
      //     }

      //     studyDocumentsMutate()
      //     dialogStore.dialog.type = 'success'
      //     dialogStore.dialog.isVisible = true
      //     dialogStore.dialog.title = 'success'
      //     dialogStore.dialog.content = 'successfuly delete!'
      //     state.selectedRowIds = {}
      //   },
      //   color: 'error',
      // },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
