import { Box, Button } from '@mui/material'
import { read, utils } from 'xlsx'
import { useEffect, useState } from 'react'

import ReactDataSheet from 'react-datasheet'
import { Utils } from '@utils'
import _ from 'lodash'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'
import { useSWRConfig } from 'swr'

type Props = {
  file: File
}

const header = [
  'id',
  'finding',
  'simulation_id',
  'main_document_id',
  'compare_with_1',
  'compare_with_2',
  'severity',
  'cfr',
  'ich_gcp',
  'domain',
  'domain_id',
]

const FindingsXlsxView = observer(({ file }: Props) => {
  const { cache, mutate } = useSWRConfig()
  const [data, setData] = useState<any[][] | null>(null)
  const {
    uiState: { modal },
  } = useRootStore()

  useEffect(() => {
    if (!file) return
    handleFile(file)
  }, [file])

  const handleFile = (file: File /*:File*/) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader()
    const rABS = !!reader.readAsBinaryString
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target?.result
      const wb = read(bstr, { type: rABS ? 'binary' : 'array' })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      /* Convert array of arrays */
      const jsonData = utils.sheet_to_json<any[]>(ws, {
        header: 1,
        defval: '',
      })
      const convertedData = convertFormat(jsonData)
      /* Update state */
      setData(convertedData)
    }
    if (rABS) reader.readAsBinaryString(file)
    else reader.readAsArrayBuffer(file)
  }

  const onClickSave = async () => {
    try {
      await axios.post('v2/findings/bulkCreate', data)
      Utils.matchMutate(cache, mutate, 'v2/findings')
      modal.close()
      setData(null)
    } catch (e) {
      console.log(e)
    }
  }

  const onClickCancel = () => {
    modal.close()
    setData(null)
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          height: '72px',
        }}
      >
        <Button onClick={onClickSave} sx={{ marginRight: '24px' }}>
          save
        </Button>
        <Button onClick={onClickCancel} sx={{ marginRight: '24px' }}>
          cancel
        </Button>
      </Box>
      <Box
        sx={{
          bgcolor: 'white',
          height: 'calc(100vh - 72px)',
          overflow: 'auto',
        }}
      >
        {data ? (
          <ReactDataSheet
            data={data}
            valueRenderer={(cell) => cell.value}
            onCellsChanged={(changes) => {
              const grid = data.map((row) => [...row])
              changes.forEach(({ cell, row, col, value }) => {
                grid[row][col] = { ...grid[row][col], value }
              })
              setData(grid)
            }}
          />
        ) : null}
      </Box>
    </Box>
  )
})

export default compose<any>()(FindingsXlsxView)

const convertFormat = (jsonData: any[][]) => {
  return jsonData.map((row) =>
    row.map((column) => ({
      value: column,
    }))
  )
}
