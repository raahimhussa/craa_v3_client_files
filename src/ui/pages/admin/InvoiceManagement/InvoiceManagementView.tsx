import * as xlsx from 'xlsx'

import {
  Box,
  Button,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import InvoicedTable from '@components/tables/InvoiceManagement/InvoicedTable/InvoicedTable'
import NotInvoicedTable from '@components/tables/InvoiceManagement/NotInvoicedTable/NotInvoicedTable'
import PaginationTable from 'src/ui/components/PaginationTable'
import axios from 'axios'
import { observer } from 'mobx-react'
import { useRootStore } from 'src/stores'

function InvoiceManagementView(props: any) {
  const { userAssessmentCycleStore } = useRootStore()
  const [fromValue, setFromValue] = useState<Dayjs | null>(null)
  const [toValue, setToValue] = useState<Dayjs | null>(null)

  const handleChangeFromValue = (newValue: Dayjs | null) => {
    if (!newValue) return
    if (toValue && newValue > toValue) return
    setFromValue(newValue)
  }
  const handleChangeToValue = (newValue: Dayjs | null) => {
    if (!newValue) return
    if (fromValue && fromValue > newValue) return
    setToValue(newValue)
  }
  const onClickReset = () => {
    setFromValue(null)
    setToValue(null)
  }

  useEffect(() => {
    userAssessmentCycleStore.invoicedFromValue = fromValue
    userAssessmentCycleStore.invoicedToValue = toValue
  }, [fromValue, toValue])

  return (
    <Box>
      <Box>
        <PaginationTable
          collectionName={'userAssessmentCycles'}
          Table={NotInvoicedTable}
          params={{
            filter: {
              $and: [
                {
                  isDeleted: false,
                },
                {
                  invoiced: false,
                },
              ],
            },
            options: { multi: true, context: 'invoice' },
          }}
          version={1}
        />
      </Box>
      <Box>
        <Box
          sx={{
            zIndex: 1,
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%,0)',
            marginTop: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '524px',
            backgroundColor: 'white',
            padding: '4px 16px',
            borderRadius: '8px',
          }}
        >
          <Typography>Invoiced from</Typography>
          {/* @ts-ignore */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              views={['year', 'month']}
              inputFormat="MMM YYYY"
              value={fromValue}
              onChange={handleChangeFromValue}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    sx={{
                      width: '140px',
                      '& input': {
                        fontSize: '13px!important',
                      },
                    }}
                    size="small"
                  />
                )
              }}
            />
            <Typography>to</Typography>
            <DesktopDatePicker
              views={['year', 'month']}
              inputFormat="MMM YYYY"
              value={toValue}
              onChange={handleChangeToValue}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    sx={{
                      width: '140px',
                      '& input': {
                        fontSize: '13px!important',
                      },
                    }}
                    size="small"
                  />
                )
              }}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            size="small"
            sx={{ ml: 1 }}
            onClick={onClickReset}
          >
            Reset
          </Button>
        </Box>
        <PaginationTable
          collectionName={'userAssessmentCycles'}
          Table={InvoicedTable}
          params={{
            filter: {
              $and: [
                {
                  isDeleted: false,
                },
                {
                  invoiced: true,
                },
              ],
            },
            options: {
              multi: true,
              context: 'invoice',
              comment: {
                fromValue: fromValue?.toDate(),
                toValue: toValue?.toDate(),
              },
            },
          }}
          version={1}
        />
      </Box>
    </Box>
  )
}
export default observer(InvoiceManagementView)
