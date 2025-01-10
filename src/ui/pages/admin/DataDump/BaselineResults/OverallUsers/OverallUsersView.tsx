import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import { BusinessCycle } from 'src/models/clientUnit/clientUnit.interface'
import Domain from 'src/models/domain'
import User from 'src/models/user'
import _ from 'lodash'
import moment from 'moment'
import { observer } from 'mobx-react'

type Props = {
  overallsByUser: {
    [userId: string]: {
      userName: string
      isUserActivated: string
      id: string
      userTitle: string
      countryName: string
      vendor: string
      bu: string
      region: string
      exp: string
      clinicalExp: string
      intDev: string
      type: string
      degree: string
      certification: string
      manager: string
      domainTotal: string
      criticalIdentified: string
      majorIdentified: string
      minorIdentified: string
      time: string
      numberOfPillsTaken: string
      numberOfPillsShouldTaken: string
      compliancePercent: string
      rescueMedication: string
      numberOfMonitoringNotes: string
      distributedDate: string
      reviewedBaselineResult: string
      baselineScoreByDomain: {
        text: string
        assigned: boolean
        passed: boolean
      }[]
      numberOfTrainingModuleAssigned: string
      followupScoreByDomain: {
        text: string
        assigned: boolean
        passed: boolean
      }[]
      difference: {
        text: string
        passed: boolean
      }[]
      quizScore: { text: string; assigned: boolean }[]
      trainingModulesRemaining: string
      followupSimulationRemaining: string
      isAllModulesCompleted: string
      unusualBehavior: string
      minimumEffort: string
      grade: string
    }
  }
  domains: Domain[]
}

const OverallUsersView = ({ overallsByUser, domains }: Props) => {
  return (
    <Table sx={{ width: 'max-content' }} id={'datadump-overallusers-table'}>
      <TableHead>
        <TableRow>
          <TableCell className="datadump-head-cell">Name</TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Status
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            ID
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Title
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Country
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Vendor
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            BU
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Region
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Exp
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Clinical Exp
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            IntDev
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Type
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Degree
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Certification
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Manager
          </TableCell>
          {/* all domains */}
          <TableCell className="datadump-head-cell" align={'center'}>
            Domain Total
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Critical % Identified
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Major % Identified
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Minor % Identified
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Time
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Number of pills taken by subject
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Number of pills that should have been taken by subject
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Percent (%) Compliance
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Rescue Medication
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Number of Monitoring Notes
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Date Distributed
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Reviewed Baseline Results
          </TableCell>
          {/* baseline main domains */}
          {domains.map((_domain) => (
            <TableCell className="datadump-head-cell" align={'center'}>
              {_domain.name}
            </TableCell>
          ))}
          <TableCell className="datadump-head-cell" align={'center'}>
            Number of Training Modules Assigned
          </TableCell>
          {/* followup main domains */}
          {domains.map((_domain) => (
            <TableCell sx={{}} className="datadump-head-cell" align={'center'}>
              Following - {_domain.name}
            </TableCell>
          ))}
          {domains.map((_domain) => (
            <TableCell className="datadump-head-cell" align={'center'}>
              Difference - {_domain.name}
            </TableCell>
          ))}
          {domains.map((_domain) => (
            <TableCell className="datadump-head-cell" align={'center'}>
              Quiz - score{_domain.name}
            </TableCell>
          ))}
          <TableCell className="datadump-head-cell" align={'center'}>
            Training Modules Remaining
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Followup Sim Remaining
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            All Modules Completed?
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Unusual Behavior
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Minimum Effort
          </TableCell>
          <TableCell className="datadump-head-cell" align={'center'}>
            Grade
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(overallsByUser).map((key) => {
          const row = overallsByUser[key]
          return (
            <TableRow key={key}>
              <TableCell className="datadump-body-cell">
                {row.userName}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.isUserActivated}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.id}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.userTitle}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.countryName}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.vendor}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.bu}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.region}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.exp}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.clinicalExp}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.intDev}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.type}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.degree}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.certification}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.manager}
              </TableCell>
              {/* all domains */}
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.domainTotal}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.criticalIdentified}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.majorIdentified}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.minorIdentified}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.time}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.numberOfPillsTaken}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.numberOfPillsShouldTaken}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.compliancePercent}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.rescueMedication}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.numberOfMonitoringNotes}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.distributedDate}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.reviewedBaselineResult}
              </TableCell>
              {row.baselineScoreByDomain.map((score) => {
                const assigned = score.assigned
                const passed = score.passed
                return (
                  <TableCell
                    className="datadump-body-cell"
                    align={'center'}
                    sx={{
                      background: assigned
                        ? passed
                          ? '#fc0d1b'
                          : '#54a54d'
                        : undefined,
                    }}
                  >
                    {score.text}
                  </TableCell>
                )
              })}
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.numberOfTrainingModuleAssigned}
              </TableCell>
              {row.followupScoreByDomain.map((score) => {
                const assigned = score.assigned
                const passed = score.passed
                const text = score.text
                return (
                  <TableCell
                    className="datadump-body-cell"
                    align={'center'}
                    sx={{
                      backgroundColor:
                        text === '-'
                          ? '#ffff00'
                          : assigned
                          ? passed
                            ? '#fc0d1b'
                            : '#54a54d'
                          : 'e9f3d4',
                    }}
                  >
                    {score.text}
                  </TableCell>
                )
              })}
              {row.difference.map((score) => {
                const passed = score.passed
                const text = score.text
                return (
                  <TableCell
                    className="datadump-body-cell"
                    align={'center'}
                    sx={{
                      backgroundColor:
                        text === '-'
                          ? '#dbdcd9'
                          : passed
                          ? '#54a54d'
                          : '#fc0d1b',
                    }}
                  >
                    {score.text}
                  </TableCell>
                )
              })}
              {row.quizScore.map((score) => {
                const assigned = score.assigned
                return (
                  <TableCell
                    className="datadump-body-cell"
                    align={'center'}
                    sx={{ backgroundColor: assigned ? '#e2e8f9' : undefined }}
                  >
                    {score.text}
                  </TableCell>
                )
              })}
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.trainingModulesRemaining}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.followupSimulationRemaining}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.isAllModulesCompleted}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.unusualBehavior}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.minimumEffort}
              </TableCell>
              <TableCell className="datadump-body-cell" align={'center'}>
                {row.grade}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default observer(OverallUsersView)
