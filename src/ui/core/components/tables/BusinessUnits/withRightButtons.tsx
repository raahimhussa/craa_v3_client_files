import { WrappingFunction } from '@shopify/react-compose'
import { Alert } from '@utils'
import axios from 'axios'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
const withRightButtons: WrappingFunction = (WrappedComponent: any) =>
  observer((props) => {
    const { state, businessUnitsMutate, businessUnits } = props
    const rightButtons = [
      {
        title: 'Delete',
        onClick: async () => {
          const selectedRowIds = toJS(state.selectedRowIds)
          const data = {
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
            await axios.patch('v1/businessUnits', data)
          } catch (error) {
            Alert.handle(error)
          } finally {
          }
          businessUnitsMutate()
          state.selectedRowIds = {}
        },
        color: 'error',
      },
    ]
    return <WrappedComponent {...props} rightButtons={rightButtons} />
  })

export default withRightButtons
