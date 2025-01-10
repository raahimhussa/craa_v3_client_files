import { Checkbox, TextField } from 'src/ui/core/components'
import { AdminColumn } from 'src/ui/core/components/DataGrid/DataGrid'
import { Accordion, AccordionDetails, AccordionSummary, Alert, AlertTitle, Card, CardContent, CardHeader, FormLabel, Grid, List, ListItem, ListItemText, Checkbox as _Checkbox } from '@mui/material'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useRootStore } from 'src/stores'
import DetailLayout from 'src/ui/layouts/DetailLayout/DetailLayout'
import uniqid from 'uniqid'
function PolicyView(props: any) {
  const {
    routePaths,
    scoringCols,
    clientCols
  } = props
  const { policyStore } = useRootStore()

  useEffect(() => {
    policyStore.setRoutes(routePaths)
  }, [])

  const routes = policyStore.routes.map(route => {
    if (policyStore.form.allowedPages.includes(route.path)) {
      route.checked = true
    } else {
      route.checked = false
    }
    return route
  })


  const onBeforeSave = () => {
    policyStore.form.allowedPages = policyStore.routes
      .filter(route => route.checked)
      .map(route => route.path)
  }

  const renderColumns = (col: AdminColumn) => {
    if (!col.accessor) {
      return null
    }

    return (
      <ListItem key={uniqid()}>
        <ListItemText>{col.Header}</ListItemText>
      </ListItem>
    )
  }


  return (
    <></>
    // <DetailLayout
    //   onBeforeSave={onBeforeSave}
    //   document={{ ...policyStore.form }}
    //   label='Policy'
    //   storeKey='policyStore'
    // >
    //   <Grid container xs={12} sx={{ height: 650, p: 2 }}>
    //     <Grid item xs={12}>
    //       <TextField
    //         sx={{ mb: 2 }}
    //         placeholder='label'
    //         size='medium'
    //         label='Label'
    //         state={policyStore}
    //         path='form.label'
    //       />
    //     </Grid>
    //     <Grid item xs={12}>
    //       <Card variant='outlined'>
    //         <CardHeader title='PageAccessControl' />
    //         <CardContent
    //           sx={{ height: 500, overflow: 'scroll' }}>
    //           <List>
    //             {routes.map((route) => {
    //               return (
    //                 <ListItem key={uniqid()}>
    //                   <ListItemText>{route.path}</ListItemText>
    //                   <FormLabel>
    //                     Allow
    //                     <Checkbox state={route} path='checked' />
    //                   </FormLabel>
    //                 </ListItem>
    //               )
    //             })}
    //           </List>
    //         </CardContent>
    //       </Card>
    //     </Grid>
    //     {/* <Grid item xs={4}>
    //       <Card variant='outlined'>
    //         <CardHeader title='ActionAccessControl' />
    //         <CardContent>
    //           <Alert>
    //             <AlertTitle>Warning</AlertTitle>
    //           </Alert>
    //           <List>
    //             {menus?.map((menu) => {
    //               return (
    //                 <ListItem>
    //                   <ListItemText>{menu.text}</ListItemText>
    //                   <FormLabel>
    //                     <Checkbox />
    //                     Allow
    //                   </FormLabel>
    //                 </ListItem>
    //               )
    //             })}
    //           </List>
    //         </CardContent>
    //       </Card>
    //     </Grid> */}
    //     {/* <Grid item xs={4}>
    //       <Card variant='outlined'>
    //         <CardHeader title='UIAccessControl' />
    //         <CardContent>
    //           <Accordion>
    //             <AccordionSummary>UserData</AccordionSummary>
    //             <AccordionDetails>
    //               <List>
    //                 {scoringCols?.map(renderColumns)}
    //               </List>
    //             </AccordionDetails>
    //           </Accordion>
    //           <Accordion>
    //             <AccordionSummary>ClientData</AccordionSummary>
    //             <AccordionDetails>
    //               <List>
    //                 {clientCols?.map(renderColumns)}
    //               </List>
    //             </AccordionDetails>
    //           </Accordion>
    //         </CardContent>
    //       </Card>
    //     </Grid> */}
    //     <Grid xs={12}>
    //     </Grid>
    //   </Grid>
    // </DetailLayout>
  )
}
export default observer(PolicyView)
