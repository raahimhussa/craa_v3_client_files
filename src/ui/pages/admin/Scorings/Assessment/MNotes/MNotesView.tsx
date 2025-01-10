import {
  Add,
  Check,
  Close,
  Delete,
  DeleteOutline,
  Edit,
  FeedbackOutlined,
  PlusOne,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Divider,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material'
import {
  NonError as INonError,
  INote,
  NonErrorStatus,
} from 'src/models/note/note.interface'
import {
  amber,
  blue,
  cyan,
  green,
  grey,
  lightBlue,
  red,
} from '@mui/material/colors'
import { useEffect, useRef, useState } from 'react'

import { AssessmentScorerType } from 'src/stores/ui/pages/assessment'
import IFolder from 'src/models/folder/folder.interface'
import UserSimulation from 'src/models/userSimulation'
import _ from 'lodash'
import axios from 'axios'
import compose from '@shopify/react-compose'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import uniqid from 'uniqid'
import { useRootStore } from 'src/stores'
import { useSnackbar } from 'notistack'
import withFindOne from 'src/hocs/withFindOne'

function MNotesView(props: {
  notes: (INote & { order: number })[]
  notesMutate: any
  userSimulation: UserSimulation
}) {
  const { noteStore } = useRootStore()
  const [folderIds, setFolderIds] = useState<string[] | null>(null)
  const [notesGroupedByFolder, setNotesGroupedByFolder] = useState<any | null>(
    null
  )
  useEffect(() => {
    noteStore.notes = props.notes
    const notes = props.notes
      .sort((a, b) => (a.seq - b.seq > 0 ? 1 : -1))
      .map((note, index) => {
        note.order = index + 1
        return note
      })
    const _notesGroupedByFolder = _.groupBy(
      notes,
      (note) => note.viewport?.simDoc?.folderId
    )
    setNotesGroupedByFolder(_notesGroupedByFolder)
    setFolderIds(Object.keys(_notesGroupedByFolder))
  }, [JSON.stringify(props.notes)])

  if (!folderIds || !notesGroupedByFolder) return <Box />

  const renderNotedGroup = () => {
    return folderIds.map((folderId) => {
      return (
        <FolderName key={uniqid()} folderId={folderId}>
          {notesGroupedByFolder[folderId].map(
            (note: INote & { order: number }, index: number) => {
              return (
                <Note
                  key={note._id}
                  note={note}
                  id={index}
                  notesMutate={props.notesMutate}
                  userSimulation={props.userSimulation}
                />
              )
            }
          )}
        </FolderName>
      )
    })
  }

  return (
    <Table className="scoring_table">
      <TableHead>
        <Header />
      </TableHead>
      <TableBody>{renderNotedGroup()}</TableBody>
    </Table>
  )
}

const Header = observer(() => {
  const {
    uiState: { assessment },
  } = useRootStore()

  const isAdjudicator =
    assessment.scorerType === AssessmentScorerType.Adjudicator
  return (
    <TableRow>
      {isAdjudicator ? null : (
        <TableCell sx={{ width: '72px !important' }}>Viewed</TableCell>
      )}
      <TableCell sx={{ width: '72px !important' }}>MN ID</TableCell>
      <TableCell sx={{ width: '72px !important' }}>Order</TableCell>
      <TableCell sx={{ width: '72px !important' }}>Pages</TableCell>
      <TableCell>Monitoring Notes</TableCell>
      <TableCell sx={{ width: '96px !important' }}>Non-Error</TableCell>
      {/* {isAdjudicator ? (
        <TableCell sx={{ width: '72px !important' }}></TableCell>
      ) : null} */}
    </TableRow>
  )
})

const Note = observer(
  ({
    note,
    id,
    notesMutate,
    userSimulation,
  }: {
    note: INote & { order: number }
    id: number
    notesMutate: any
    userSimulation: UserSimulation
  }) => {
    const {
      uiState: { assessment },
    } = useRootStore()

    const isAdjudicator =
      assessment.scorerType === AssessmentScorerType.Adjudicator

    const isNeededToAdjudicate =
      note.nonErrors &&
      note.nonErrors.length > 0 &&
      note.nonErrors.filter(
        (_nonError) => _nonError.status === NonErrorStatus.Final
      ).length === 0

    const hasAdjudicated =
      note.nonErrors &&
      note.nonErrors.length > 0 &&
      note.nonErrors.filter(
        (_nonError) => _nonError.status === NonErrorStatus.Final
      ).length > 0

    return (
      <TableRow
        sx={{
          backgroundColor: isAdjudicator
            ? isNeededToAdjudicate
              ? '#fff429 !important'
              : hasAdjudicated
              ? '#d3ffb1 !important'
              : undefined
            : null,
        }}
      >
        {isAdjudicator ? null : (
          <TableCell>
            <ScorerCheck note={note} />
          </TableCell>
        )}

        <TableCell
          sx={{
            backgroundColor:
              note.reopenCount === 0
                ? undefined
                : userSimulation.reopenCount === note.reopenCount
                ? 'rgba(255,0,0,0.3)'
                : undefined,
          }}
        >
          {note.MNID}
        </TableCell>
        <TableCell>
          <Order order={note.order} />
        </TableCell>
        <TableCell>1</TableCell>
        <TableCell>
          <Typography sx={{ fontSize: '13.8px', textAlign: 'left', pl: 0.3 }}>
            {note.text}
          </Typography>
        </TableCell>
        <TableCell>
          <NonError note={note} notesMutate={notesMutate} />
        </TableCell>
        {/* {isAdjudicator ? (
          <TableCell>
            <NonErrorInfo note={note} />
          </TableCell>
        ) : null} */}
      </TableRow>
    )
  }
)

const ScorerCheck = observer(
  ({ note }: { note: INote & { order: number } }) => {
    const {
      authStore: { user },
      uiState: { assessment },
    } = useRootStore()
    const [checked, setChecked] = useState<boolean>(
      note?.scorerCheck?.[
        assessment.scorerType as 'firstScorer' | 'secondScorer'
      ]
        ? true
        : false
    )
    const { enqueueSnackbar } = useSnackbar()

    const isAdjudicator =
      assessment.scorerType === AssessmentScorerType.Adjudicator

    const onClickCheck = async () => {
      try {
        await axios.patch('v2/notes', {
          filter: { _id: note._id },
          update: {
            $set: {
              [`scorerCheck.${assessment.scorerType}`]: !checked,
            },
          },
        })
        setChecked((prev) => !prev)
        checked
          ? enqueueSnackbar('unchecked successfully', { variant: 'success' })
          : enqueueSnackbar('checked successfully', { variant: 'success' })
      } catch (e) {
        console.error(e)
        checked
          ? enqueueSnackbar('unchecked failed', { variant: 'error' })
          : enqueueSnackbar('checked failed', { variant: 'error' })
      }
    }

    if (isAdjudicator) return null
    return (
      <Button onClick={onClickCheck}>
        {checked ? (
          <Check color="success" />
        ) : (
          <Check sx={{ color: 'rgba(128,128,128,0.3)' }} />
        )}
      </Button>
    )
  }
)

const NonError = observer(
  ({ note, notesMutate }: { note: INote; notesMutate: any }) => {
    const {
      authStore: { user },
      uiState: { assessment },
    } = useRootStore()
    const [open, setOpen] = useState<boolean>(false)
    const [nonErrorText, setNonErrorText] = useState<string>(
      note.nonErrors?.find((_nonError) => _nonError._id === user._id)?.text ||
        ''
    )
    const [nonErrors, setNonErrors] = useState<INonError[]>(
      note.nonErrors ? note.nonErrors : []
    )
    // const editTextRef = useRef<HTMLInputElement>(null)
    const { enqueueSnackbar } = useSnackbar()

    const isAdjudicator =
      assessment.scorerType === AssessmentScorerType.Adjudicator

    const onClickUpdate = async () => {
      try {
        if (nonErrors?.find((_nonError) => _nonError._id === user._id)) {
          await axios.patch('v2/notes', {
            filter: {
              _id: note._id,
              nonErrors: { $elemMatch: { _id: { $eq: user._id } } },
            },
            update: {
              $set: isAdjudicator
                ? {
                    'nonErrors.$._id': user._id,
                    'nonErrors.$.text': nonErrorText,
                    'nonErrors.$.status': NonErrorStatus.Final,
                  }
                : {
                    'nonErrors.$._id': user._id,
                    'nonErrors.$.text': nonErrorText,
                    // 'nonErrors.$.status': NonErrorStatus.Pending,
                  },
            },
          })
        } else {
          await axios.patch('v2/notes', {
            filter: {
              _id: note._id,
            },
            update: {
              $push: {
                nonErrors: {
                  _id: user._id,
                  text: nonErrorText,
                  status: isAdjudicator
                    ? NonErrorStatus.Final
                    : NonErrorStatus.Pending,
                },
              },
            },
          })
        }
        setNonErrorText(nonErrorText)
        notesMutate && (await notesMutate())
        enqueueSnackbar('non-error saved successfully', { variant: 'success' })
      } catch (e) {
        console.error(e)
        enqueueSnackbar('non-error saved failed', { variant: 'error' })
      }
      setOpen(false)
    }

    const onClickDelete = async () => {
      try {
        await axios.patch('v2/notes', {
          filter: {
            _id: note._id,
          },
          update: {
            $pull: {
              nonErrors: {
                _id: user._id,
              },
            },
          },
        })

        setNonErrorText('')
        notesMutate && (await notesMutate())
        enqueueSnackbar('non-error deleted successfully', {
          variant: 'success',
        })
      } catch (e) {
        console.error(e)
        enqueueSnackbar('non-error deleted failed', { variant: 'error' })
      }
      setOpen(false)
    }

    const isNeededToAdjudicate =
      note.nonErrors &&
      note.nonErrors.length > 0 &&
      note.nonErrors.filter(
        (_nonError) => _nonError.status === NonErrorStatus.Final
      ).length === 0

    const hasAdjudicated =
      note.nonErrors &&
      note.nonErrors.length > 0 &&
      note.nonErrors.filter(
        (_nonError) => _nonError.status === NonErrorStatus.Final
      ).length > 0

    const style = {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      // width: 676,
      // height: 720,
      boxShadow: 24,
      bgcolor: 'white',
      p: 3,
      borderRadius: '15px',
    }

    //FIXME - **
    if (isAdjudicator)
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '44px',
          }}
        >
          {nonErrors?.find((_nonError) => _nonError._id !== user._id) ? (
            <button
              onClick={() => setOpen(true)}
              style={{
                backgroundColor: nonErrors.find(
                  (_nonError) => _nonError._id === user._id
                )?.text
                  ? lightBlue[200]
                  : 'white',
                border: '1px solid grey',
                cursor: 'pointer',
                margin: '0px 4px 0px 4px',
                width: '26px',
                height: '26px',
              }}
            >
              <FeedbackOutlined
                sx={{
                  color: nonErrors.find(
                    (_nonError) => _nonError._id === user._id
                  )?.text
                    ? '#222222'
                    : 'black',
                }}
              />
            </button>
          ) : nonErrors?.find((_nonError) => _nonError._id === user._id) ? (
            <>
              <button
                onClick={() => {
                  setNonErrorText(
                    note.nonErrors?.find(
                      (_nonError) => _nonError._id === user._id
                    )?.text || ''
                  )
                  setOpen(true)
                }}
                style={{
                  backgroundColor: green[500],
                  border: '0.1px solid grey',
                  cursor: 'pointer',
                  margin: '0px 4px 0px 4px',
                  width: '26px',
                  height: '26px',
                }}
              >
                <Edit fontSize="small" sx={{ color: 'whitesmoke' }} />
              </button>
              <button
                onClick={onClickDelete}
                style={{
                  backgroundColor: amber[500],
                  border: '0.1px solid grey',
                  cursor: 'pointer',
                  margin: '0px 4px 0px 4px',
                  width: '26px',
                  height: '26px',
                }}
              >
                <DeleteOutline fontSize="small" sx={{ color: 'whitesmoke' }} />
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setNonErrorText(
                  note.nonErrors?.find(
                    (_nonError) => _nonError._id === user._id
                  )?.text || ''
                )
                setOpen(true)
              }}
              style={{
                backgroundColor: lightBlue[200],
                border: '0.1px solid grey',
                cursor: 'pointer',
                margin: '0px 4px 0px 4px',
                width: '26px',
                height: '26px',
              }}
            >
              <Add sx={{ color: 'whitesmoke' }} />
            </button>
          )}
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography variant="h6">
                Non-Error [MNID {note.MNID}]{' '}
                {nonErrors?.find((_nonError) => _nonError._id === user._id)
                  ? '- Saved'
                  : ''}
              </Typography>
              {nonErrors.filter((_nonError) => _nonError._id !== user._id)
                .length > 0 ? (
                <table style={{ border: '1px solid black' }}>
                  <tr
                    style={{
                      border: '1px solid black',
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                  >
                    <th
                      style={{
                        border: '1px solid black',
                        width: '64px',
                      }}
                    />
                    <th
                      style={{
                        border: '1px solid black',
                        width: '128px',
                      }}
                    >
                      Scorer
                    </th>
                    <th
                      style={{
                        border: '1px solid black',
                        width: '328px',
                      }}
                    >
                      Non-error
                    </th>
                    <th
                      style={{
                        border: '1px solid black',
                        width: '96px',
                      }}
                    >
                      Status
                    </th>
                  </tr>
                  {nonErrors
                    ?.filter((_nonError) => _nonError._id !== user._id)
                    .map((_nonError) => {
                      const checkColor = () => {
                        if (_nonError.status === NonErrorStatus.Accepted)
                          return green[500]
                        if (_nonError.status === NonErrorStatus.Rejected)
                          return red[500]
                        if (_nonError.status === NonErrorStatus.Pending)
                          return grey[500]
                        return grey[500]
                      }

                      const onClickCheck = async () => {
                        try {
                          await axios.patch('v2/notes', {
                            filter: {
                              _id: note._id,
                              nonErrors: {
                                $elemMatch: { _id: { $eq: _nonError._id } },
                              },
                            },
                            update: {
                              $set: {
                                'nonErrors.$.status':
                                  _nonError.status === NonErrorStatus.Accepted
                                    ? NonErrorStatus.Rejected
                                    : NonErrorStatus.Accepted,
                              },
                            },
                          })
                          setNonErrors((prev) => {
                            return [...prev].map((_ne) => {
                              if (_ne._id === _nonError._id)
                                return {
                                  ..._ne,
                                  status:
                                    _nonError.status === NonErrorStatus.Accepted
                                      ? NonErrorStatus.Rejected
                                      : NonErrorStatus.Accepted,
                                }
                              return { ..._ne }
                            })
                          })
                          _nonError.status !== NonErrorStatus.Accepted &&
                            setNonErrorText(_nonError.text)
                          // notesMutate && (await notesMutate())
                          enqueueSnackbar('non-error saved successfully', {
                            variant: 'success',
                          })
                        } catch (e) {
                          console.error(e)
                          enqueueSnackbar('non-error saved failed', {
                            variant: 'error',
                          })
                        }
                      }

                      return (
                        <tr style={{ border: '1px solid black' }}>
                          <td
                            style={{
                              width: '64px',
                              border: '1px solid black',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '4px',
                            }}
                          >
                            <button
                              style={{
                                backgroundColor: 'white',
                                borderWidth: 0,
                                cursor: 'pointer',
                              }}
                            >
                              <Box
                                sx={{
                                  width: '28px',
                                  backgroundColor: checkColor(),
                                  borderRadius: 100,
                                }}
                                onClick={onClickCheck}
                              >
                                <Check sx={{ color: 'whitesmoke' }} />
                              </Box>
                            </button>
                          </td>
                          <td
                            style={{
                              border: '1px solid black',
                              width: '128px',
                              wordBreak: 'break-all',
                            }}
                          >
                            {note.users?.find(
                              (_user) => _user._id === _nonError._id
                            )?.name || 'unidentified'}
                          </td>
                          <td
                            style={{
                              border: '1px solid black',
                              width: '328px',
                              wordBreak: 'break-all',
                            }}
                          >
                            {_nonError.text}
                          </td>
                          <td
                            style={{
                              border: '1px solid black',
                              width: '86px',
                              wordBreak: 'break-all',
                            }}
                          >
                            {_nonError.status}
                          </td>
                        </tr>
                      )
                    })}
                </table>
              ) : null}
              <TextField
                autoFocus
                inputProps={{ style: { padding: '12px', width: 580 } }}
                onChange={(e) => setNonErrorText(e.target.value)}
                value={nonErrorText}
                multiline
                rows={5}
                fullWidth
                sx={{ mt: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onClickUpdate}>Save</Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      )

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '44px',
        }}
      >
        {nonErrors?.find((_nonError) => _nonError._id === user._id) ? (
          <>
            <button
              onClick={() => setOpen(true)}
              style={{
                backgroundColor: green[500],
                border: '0.1px solid grey',
                cursor: 'pointer',
                margin: '0px 4px 0px 4px',
                width: '26px',
                height: '26px',
              }}
            >
              <Edit fontSize="small" sx={{ color: 'whitesmoke' }} />
            </button>
            <button
              onClick={onClickDelete}
              style={{
                backgroundColor: amber[500],
                border: '0.1px solid grey',
                cursor: 'pointer',
                margin: '0px 4px 0px 4px',
                width: '26px',
                height: '26px',
              }}
            >
              <Delete fontSize="small" sx={{ color: 'whitesmoke' }} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setOpen(true)}
            style={{
              backgroundColor: lightBlue[200],
              border: '0.1px solid grey',
              cursor: 'pointer',
              margin: '0px 4px 0px 4px',
              width: '26px',
              height: '26px',
            }}
          >
            <Add sx={{ color: 'whitesmoke' }} />
          </button>
        )}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, width: '100%' }}>
            <Typography variant="h6">Non-Error [MNID {note.MNID}]</Typography>
            <TextField
              autoFocus
              inputProps={{ style: { padding: '12px' } }}
              value={nonErrorText}
              onChange={(e) => setNonErrorText(e.target.value)}
              multiline
              rows={5}
              fullWidth
              sx={{ mt: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onClickUpdate}>Save</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    )
  }
)

// const NonErrorInfo = observer(({ note }: { note: INote }) => {
//   const {
//     authStore: { user },
//     uiState: { assessment },
//   } = useRootStore()
//   const [open, setOpen] = useState<boolean>(false)

//   if (!note.nonErrors || note?.nonErrors.length === 0) return null

//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       <ThemeTooltip
//         open={open}
//         title={
//           <Box
//             style={{
//               color: 'black',
//               fontSize: 14,
//               fontWeight: 'normal',
//             }}
//           >
//             <Button onClick={() => setOpen(false)}>
//               <Close />
//             </Button>
//             <table style={{ border: '1px solid black' }}>
//               <tr
//                 style={{
//                   border: '1px solid black',
//                   fontSize: 14,
//                   fontWeight: 'bold',
//                 }}
//               >
//                 <th
//                   style={{
//                     border: '1px solid black',
//                     width: '60px',
//                   }}
//                 >
//                   Scorer
//                 </th>
//                 <th
//                   style={{
//                     border: '1px solid black',
//                     width: '270px',
//                   }}
//                 >
//                   Non-error
//                 </th>
//                 <th
//                   style={{
//                     border: '1px solid black',
//                     width: '60px',
//                   }}
//                 >
//                   Status
//                 </th>
//               </tr>
//               {note.nonErrors?.map((_nonError) => {
//                 return (
//                   <tr style={{ border: '1px solid black' }}>
//                     <td
//                       style={{
//                         border: '1px solid black',
//                         width: '60px',
//                         wordBreak: 'break-all',
//                       }}
//                     >
//                       {note.users?.find((_user) => _user._id === _nonError._id)
//                         ?.name || 'unidentified'}
//                     </td>
//                     <td
//                       style={{
//                         border: '1px solid black',
//                         width: '270px',
//                         wordBreak: 'break-all',
//                       }}
//                     >
//                       {_nonError.text}
//                     </td>
//                     <td
//                       style={{
//                         border: '1px solid black',
//                         width: '60px',
//                         wordBreak: 'break-all',
//                       }}
//                     >
//                       {_nonError.status}
//                     </td>
//                   </tr>
//                 )
//               })}
//             </table>
//           </Box>
//         }
//         placement="left"
//       >
//         <button
//           onClick={() => setOpen(true)}
//           style={{
//             backgroundColor: 'white',
//             border: '1px solid grey',
//             cursor: 'pointer',
//             margin: '0px 4px 0px 4px',
//             width: '26px',
//             height: '26px',
//           }}
//         >
//           <FeedbackOutlined />
//         </button>
//       </ThemeTooltip>
//     </Box>
//   )
// })

// const ThemeTooltip = styled(({ className, ...props }: TooltipProps) => (
//   <Tooltip {...props} classes={{ popper: className }} />
// ))(({ theme }) => {
//   return {
//     [`& .${tooltipClasses.tooltip}`]: {
//       maxWidth: '100%',
//       maxHeight: '100%',
//       backgroundColor: theme.palette.background.neutral,
//     },
//   }
// })

const Order = observer(({ order = 0 }: { order?: number }) => {
  return (
    // <Box
    //   sx={{
    //     borderRadius: 30,
    //     border: 0.5,
    //     height: 23,
    //     width: 23,
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //   }}
    // >
    //   <Typography>{order}</Typography>
    // </Box>
    <Chip label={order} size="small" />
  )
})

const FolderNameView = observer(
  ({ folder, children }: { folder: IFolder; children: React.ReactNode }) => {
    return (
      <>
        <TableRow>
          <TableCell
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontSize: 16,
              fontWeight: 600,
              textAlign: 'center',
              bgcolor: 'rgb(253, 241, 231,0.5)',
            }}
            colSpan={6}
          >
            {folder.name}
            <Divider />
          </TableCell>
          {/*  */}
        </TableRow>
        {children}
      </>
    )
  }
)

export const FolderName = compose<any>(
  withFindOne({
    collectionName: 'folders',
    version: 2,
    getFilter: (props: { folderId: string }) => ({
      _id: props.folderId,
    }),
  })
)(FolderNameView)

export default observer(MNotesView)
