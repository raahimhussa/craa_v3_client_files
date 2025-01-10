import {
  Box,
  Checkbox,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import {
  Cell,
  HeaderGroup,
  Row,
  TableInstance,
  TableOptions,
  useBlockLayout,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'
import React, { useEffect, useState } from 'react'

import SearchInput from 'src/ui/core/components/SearchInput/SearchInput'
import Typography from 'src/theme/overrides/Typography'
import { matchSorter } from 'match-sorter'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
import uniqid from 'uniqid'

// @ts-ignore
const headerProps = (props, { column }) => getStyles(props, 'left')

// @ts-ignore
const cellProps = (props, { cell }) => getStyles(props, 'left')

// @ts-ignore
const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]
function fuzzyTextFilterFn(rows: any, id: string | number, filterValue: any) {
  return matchSorter(rows, filterValue, {
    keys: [(row: any) => row.values[id]],
  })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val
function DataGridView(props: any) {
  const {
    state,
    columns,
    data = [],
    renderRowSubComponent = ({ row }: any) => (
      <div>renderRowSubComponent is needed</div>
    ),
  } = props
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any[], id: string | number, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 200, // minWidth is only used as a limit for resizing
      width: 200, // width is used for both the flex-basis and flex-grow
      maxWidth: 400, // maxWidth is only used as a limit for resizing
      Filter: DefaultColumnFilter,
    }),
    []
  )
  const options: TableOptions<object> & any = {
    columns: columns,
    data: data,
    defaultColumn,
    filterTypes,
  }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    preGlobalFilteredRows,
    setGlobalFilter,
    visibleColumns,
    rows,
    state: { expanded, pageIndex, pageSize, selectedRowIds, globalFilter },
  }: TableInstance<any> = useTable(
    options,
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useResizeColumns,
    // useFlexLayout,
    // useBlockLayout,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          disableResizing: true,
          minWidth: 35,
          width: 50,
          maxWidth: 50,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
      // hooks.visibleColumns.push((columns) => [
      //   {
      //     id: 'selection',
      //     Header: ({ getToggleAllPageRowsSelectedProps }) => {
      //       return (
      //         <div>
      //           <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
      //         </div>
      //       )
      //     },
      //     Cell: ({ row }) => {
      //       return <div><IndeterminateCheckbox {...row.getToggleRowSelectedProps()} /></div>
      //     },
      //   },
      //   ...columns,
      // ])
      // hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
      //   // fix the parent group of the selection button to not be resizable
      //   const selectionGroupHeader = headerGroups[0].headers[0]
      //   selectionGroupHeader.canResize = false
      // })
    }
  )

  useEffect(() => {
    state.selectedRowIds = selectedFlatRows
      .map((selectedFlatRow) => selectedFlatRow.original)
      .map((original) => {
        return original._id
      })
  }, [selectedFlatRows])

  const tableCellStyle: any = {
    style: {
      lineHeight: 3.5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      // overflow: 'hidden',
      // textOverflow: 'clip'
    },
  }
  // if (props.isSubTable) {
  //   return (
  //     <div>
  //       {/* <Box sx={{ width: 500, mb: 2 }}></Box> */}
  //       {/* <CssBaseline /> */}
  //       <TableContainer sx={{ boxShadow: 2 }}>
  //         <Table {...getTableProps()} size="small">
  //           <TableHead>
  //             {headerGroups.map((headerGroup: HeaderGroup) => (
  //               <TableRow {...headerGroup.getHeaderGroupProps()}>
  //                 {headerGroup.headers.map((column) => {
  //                   return (
  //                     <TableCell
  //                       sx={{
  //                         padding: 0,
  //                       }}
  //                       {...(column.id === 'selection'
  //                         ? column.getHeaderProps(tableCellStyle)
  //                         : column.getHeaderProps(
  //                             column.getSortByToggleProps(tableCellStyle)
  //                           ))}
  //                     >
  //                       <span className="title">{column.render('Header')}</span>
  //                       {column.id !== 'selection' ? (
  //                         <TableSortLabel
  //                           active={column.isSorted}
  //                           direction={column.isSortedDesc ? 'desc' : 'asc'}
  //                         />
  //                       ) : null}
  //                       {column.canResize && (
  //                         <div
  //                           {...column.getResizerProps({
  //                             style: {
  //                               top: 0,
  //                               right: 0,
  //                               zIndex: 1,
  //                               width: 10,
  //                               height: '100%',
  //                               position: 'absolute',
  //                               touch: 'none',
  //                             },
  //                           })}
  //                           className={`resizer ${
  //                             column.isResizing ? 'isResizing' : ''
  //                           }`}
  //                         />
  //                       )}
  //                       <div>
  //                         {column.canFilter ? column.render('Filter') : null}
  //                       </div>
  //                     </TableCell>
  //                   )
  //                 })}
  //               </TableRow>
  //             ))}
  //           </TableHead>
  //           <TableBody {...getTableBodyProps()}>
  //             {rows.map((row: Row) => {
  //               prepareRow(row)
  //               return (
  //                 <React.Fragment key={uniqid()}>
  //                   <TableRow {...row.getRowProps()} hover>
  //                     {row.cells.map((cell: Cell) => {
  //                       return (
  //                         <TableCell
  //                           sx={{
  //                             fontSize: '0.75rem',
  //                             padding: '0.5rem 0',
  //                           }}
  //                           {...cell.getCellProps(tableCellStyle)}
  //                           // className="td"
  //                         >
  //                           {cell.render('Cell')}
  //                         </TableCell>
  //                       )
  //                     })}
  //                   </TableRow>
  //                   {row.isExpanded && renderRowSubComponent ? (
  //                     <TableRow sx={{ overflow: 'scroll' }}>
  //                       <TableCell colSpan={visibleColumns.length}>
  //                         {renderRowSubComponent({ row })}
  //                       </TableCell>
  //                     </TableRow>
  //                   ) : null}
  //                 </React.Fragment>
  //               )
  //             })}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     </div>
  //   )
  return (
    <div>
      {/* <Box
        sx={{ width: 250, mb: 2, display: props.isSubTable ? 'none' : 'block' }}
      >
        <SearchInput
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
      </Box> */}
      {/* <CssBaseline /> */}
      <TableContainer
        sx={{
          boxShadow: 2,
          border: props.isSubTable ? '1px solid black' : '',
          borderColor: props.isSubTable ? palette.light.button.blue : '',
          mb: props.isSubTable ? 2.5 : 0,
          mt: 5,
        }}
      >
        <Table {...getTableProps()} size="small">
          <TableHead>
            {headerGroups.map((headerGroup: HeaderGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <TableCell
                      sx={{
                        fontSize: '0.75rem',
                      }}
                      {...(column.id === 'selection'
                        ? column.getHeaderProps(tableCellStyle)
                        : column.getHeaderProps(
                            column.getSortByToggleProps(tableCellStyle)
                          ))}
                    >
                      <div
                        className={`title ${
                          (column as any)?.headerClassName
                            ? (column as any).headerClassName
                            : ''
                        }`}
                      >
                        <span>{column.render('Header')}</span>
                        {column.id !== 'selection' ? (
                          <TableSortLabel
                            active={column.isSorted}
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                          />
                        ) : null}
                      </div>
                      {column.canResize && (
                        <div
                          {...column.getResizerProps({
                            style: {
                              top: 0,
                              right: 0,
                              zIndex: 1,
                              width: 10,
                              height: '100%',
                              position: 'absolute',
                              touch: 'none',
                            },
                          })}
                          className={`resizer ${
                            column.isResizing ? 'isResizing' : ''
                          }`}
                        />
                      )}
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row: Row) => {
              prepareRow(row)
              return (
                <React.Fragment key={uniqid()}>
                  <TableRow {...row.getRowProps()} hover>
                    {row.cells.map((cell: Cell) => {
                      return (
                        <TableCell
                          sx={{
                            fontSize: '0.75rem',
                          }}
                          {...cell.getCellProps({
                            ...tableCellStyle,
                          })}
                          style={{
                            ...cell.getCellProps({
                              ...tableCellStyle,
                              width: cell.column?.width,
                            }).style,
                            width: cell.column?.width,
                          }}
                          // className="td"
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent ? (
                    <TableRow
                      sx={{
                        overflow: 'scroll',
                      }}
                    >
                      <TableCell
                        colSpan={visibleColumns.length}
                        sx={{
                          bgcolor: '#f2f2f2',
                          pl: '0 !important',
                        }}
                      >
                        {renderRowSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default observer(DataGridView)

export const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, style, ...rest }: any, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef: any = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return <Checkbox ref={resolvedRef} {...rest} />
  }
)

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: any) {
  const count = preFilteredRows.length
  const [open, setOpen] = useState(false)
  const onClickMore = (e: any) => {
    e.stopPropagation()
    setOpen((state) => !state)
  }
  return null
  // <Box sx={{
  //   position: 'absolute',
  //   top: 5,
  //   right: 2
  // }}>
  //   <IconButton
  //     onClick={onClickMore}
  //   >
  //     <MoreVert />
  //   </IconButton>
  //   {open &&
  //     <Box
  //       sx={{
  //         position: 'absolute',
  //         bottom: -25,
  //         right: 25,
  //         width: 150,
  //       }}>
  //       <TextField
  //         sx={{
  //           bgcolor: 'white'
  //         }}
  //         size='small'
  //         value={filterValue || ''}
  //         onChange={e => {
  //           setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
  //         }}
  //         placeholder={`search`}
  //       />
  //     </Box>
  //   }
  // </Box>
}
