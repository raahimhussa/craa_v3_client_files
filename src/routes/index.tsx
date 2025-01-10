import { Navigate, useRoutes } from 'react-router-dom'
import Profile from 'src/ui/pages/admin/Profile/Profile'
import Adjudication from 'src/ui/pages/admin/Scorings/Assessment/Adjudication/Adjudication'
import Adjudications from 'src/ui/pages/admin/Scorings/Assessment/Adjudications/Adjudications'
import Agreements from 'src/ui/pages/admin/Agreements/Agreements'
import Assessment from 'src/ui/pages/admin/Scorings/Assessment/Assessment'
import AssessmentCycles from 'src/ui/pages/admin/AssessmentCycles/AssessmentCycles'
import AssessmentTypes from 'src/ui/pages/admin/AssessmentTypes/AssessmentTypes'
import BuStatus from 'src/ui/pages/admin/BuStatus/BuStatus'
import Clients from 'src/ui/pages/admin/Clients/Clients'
import ComingSoon from 'src/ui/pages/ComingSoon'
import { Container } from '@mui/material'
import DashboardLayout from 'src/ui/layouts/dashboard'
import DataDump from 'src/ui/pages/admin/DataDump/DataDump'
import Domains from 'src/ui/pages/admin/Domains/Domains'
import Files from 'src/ui/pages/admin/Files/Files'
import Findings from 'src/ui/pages/admin/Findings/Findings'
import Folders from 'src/ui/pages/admin/Folders/Folders'
import InvoiceManagement from 'src/ui/pages/admin/InvoiceManagement/InvoiceManagement'
import KeyConcepts from 'src/ui/pages/admin/KeyConcepts/KeyConcepts'
import LogoOnlyLayout from 'src/ui/layouts/LogoOnlyLayout'
import Maintenance from 'src/ui/pages/Maintenance'
import { PATH_AFTER_LOGIN } from 'src/config'
import Page403 from 'src/ui/pages/Page403'
import Page404 from 'src/ui/pages/Page404'
import Page500 from 'src/ui/pages/Page500'
import Policies from 'src/ui/pages/admin/Policies/Policies'
import { ReactNode } from 'react'
import Roles from 'src/ui/pages/admin/Roles/Roles'
import ScoringManagement from 'src/ui/pages/admin/ScoringManagement/ScoringManagement'
import Scorings from 'src/ui/pages/admin/Scorings/Scorings'
import Signin from 'src/ui/pages/auth/Signin/Signin'
import SimDistributions from 'src/ui/pages/admin/SimDistributions/SimDistributions'
import SimDocs from 'src/ui/pages/admin/SimDocs/SimDocs'
import Simulations from 'src/ui/pages/admin/Simulations/Simulations'
import Templates from 'src/ui/pages/admin/Templates/Templates'
import User from 'src/models/user'
import UserSimulations from 'src/ui/pages/admin/SimManagement/SimManagement'
import UserStatus from 'src/ui/pages/admin/UserStatus/UserStatus'
import Users from 'src/ui/pages/admin/Users/Users'
import Vendors from 'src/ui/pages/admin/Vendors/Vendors'
import { observer } from 'mobx-react'
import { useUser } from '@hooks'

const mode = import.meta.env.MODE

export default function Router() {
  const { data: user, isValidating } = useUser()
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'signin',
          element: (
            // <Container sx={{ mt: 20 }}>
            <Signin />
            // </Container>
          ),
        },
      ],
    },
    {
      path: 'admin',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          element: <Navigate to={PATH_AFTER_LOGIN} replace />,
          index: true,
        },
        {
          path: 'data',
          // element: <DataDump />,
          children: [
            // {
            //   path: 'dataDump',
            //   element: <DataDump />,
            // },
            {
              path: 'butrstatus',
              element: <BuStatus authorization={user?.authority} />,
            },
          ],
        },
        {
          path: 'simManagement',
          element: (
            <UserSimulations user={user} authorization={user?.authority} />
          ),
        },
        {
          path: 'users',
          children: [
            // {
            //   path: 'roles',
            //   element: <Roles />,
            // },
            // {
            //   path: 'clients',
            //   element: <Clients />,
            // },
            {
              path: 'userManagement',
              //@ts-ignore
              element: <Users user={user} authorization={user?.authority} />,
            },
            // {
            //   path: 'simManagement',
            //   element: <UserSimulations />,
            // },
            // // {
            //   path: 'invoice',
            //   element: <InvoiceManagement />,
            // },
            {
              path: 'profile',
              element: <Profile />,
            },
            {
              path: 'userStatusManagement',
              element: (
                <UserStatus user={user} authorization={user?.authority} />
              ),
            },
          ],
        },
        // {
        //   path: 'scoring',
        //   children: [
        //     {
        //       path: 'manage',
        //       element: <ScoringManagement />,
        //     },
        //     {
        //       path: 'score',
        //       element: <Scorings user={user} />,
        //     },
        //     {
        //       path: 'score/userSimulations/:userSimulationId',
        //       element: <Assessment />,
        //     },
        //     {
        //       path: 'adjudicate',
        //       element: <Adjudications user={user} />,
        //     },
        //     {
        //       path: 'adjudicate/userSimulations/:userSimulationId',
        //       element: <Assessment />,
        //     },
        //     {
        //       path: 'review',
        //       element: null,
        //     },
        //     {
        //       path: 'performance',
        //       element: null,
        //     },
        //     {
        //       path: 'simDistributions',
        //       element: <SimDistributions />,
        //     },
        //   ],
        // },
        // {
        //   path: 'assessmentCycles',
        //   children: [
        //     {
        //       path: 'assessmentCycles',
        //       element: <AssessmentCycles />,
        //     },
        //     {
        //       path: 'files',
        //       element: <Files />,
        //     },
        //     {
        //       path: 'resources',
        //       element: <SimDocs />,
        //     },
        // {
        //   path: 'simulations',
        //   element: <Simulations />,
        // },
        //     {
        //       path: 'assessmentTypes',
        //       element: <AssessmentTypes />,
        //     },
        //   ],
        // },

        // {
        //   path: 'findings',
        //   children: [
        //     {
        //       path: 'list',
        //       element: <Findings />,
        //     },
        //     {
        //       path: 'keyConcepts',
        //       element: <KeyConcepts />,
        //     },
        //     {
        //       path: 'domains',
        //       element: <Domains depth={0} />,
        //     },
        //   ],
        // },
        // {
        //   path: 'system',
        //   children: [
        //     {
        //       path: 'privacyPolicy',
        //       element: <Agreements />,
        //     },
        //     {
        //       path: 'emailTemplates',
        //       element: <Templates />,
        //     },
        //   ],
        // },

        // {
        //   path: 'policies',
        //   element: <Policies />,
        // },

        // {
        //   path: 'vendor',
        //   element: <Vendors />,
        // },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoon /> },
        { path: 'maintenance', element: <Maintenance /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '/', element: <Navigate to="/admin/users" replace /> },
  ])
}

type RoleGuardProps = {
  children: ReactNode
}

const AuthGuard = observer((props: RoleGuardProps) => {
  const { children } = props

  const { data: user, isValidating } = useUser()

  if (isValidating) return null
  // if (!user) return <Navigate to={'/auth/signin'} />
  if (!user) {
    if (mode === 'production') {
      window.location.replace('https://craa-app-dev-3.hoansoft.com/auth/signin')
    } else {
      window.location.replace('http://localhost:3001/auth/signin')
    }
  }
  if (
    user.role.title !== 'ClientAdmin' &&
    user.role.title !== 'ClientSubAdmin' &&
    user.role.title !== 'SuperAdmin' &&
    user.role.title !== 'Admin'
  ) {
    if (mode === 'production') {
      window.location.replace('https://craa-app-dev-3.hoansoft.com/auth/signin')
    } else {
      window.location.replace('http://localhost:3001/auth/signin')
    }
  }

  return <>{children}</>
})
