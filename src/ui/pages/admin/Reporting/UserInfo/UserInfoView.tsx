import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import IUser, { LocalUser } from 'src/models/user/user.interface'

import { ApexOptions } from 'apexcharts'
import IDomain from 'src/models/domain/domain.interface'
import ReactApexChart from 'react-apexcharts'
import { ScoreByDomain } from 'src/models/userSimulation/userSimulation.interface'
import UserSimulation from 'src/models/userSimulation'
import { UserSimulationStatus } from 'src/utils/status'
import _ from 'lodash'
import { observer } from 'mobx-react'

type UserInfoProps = {
  user: IUser & LocalUser
  userBaseline: UserSimulation
  userFollowups: UserSimulation[]
  domains: IDomain[]
  radarStatus: number
}

export default observer((props: UserInfoProps) => {
  const { user, domains, userBaseline, userFollowups, radarStatus } = props
  console.log(user)
  const options: ApexOptions = {
    chart: {
      type: 'boxPlot',
      height: 350,
    },
    title: {
      text: 'Basic BoxPlot Chart',
      align: 'left',
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#5C4742',
          lower: '#A5978B',
        },
      },
    },
  }

  const usage = null
  // assessment &&
  // Utils.convert(
  //   assessment.userAssessmentCycle.userSimulation.usageTime,
  //   'astr'
  // )

  const series = [
    {
      type: 'boxPlot',
      data: [
        {
          x: 'Jan 2015',
          y: [54, 66, 69, 75, 88],
        },
        {
          x: 'Jan 2016',
          y: [43, 65, 69, 76, 81],
        },
        {
          x: 'Jan 2017',
          y: [31, 39, 45, 51, 59],
        },
        {
          x: 'Jan 2018',
          y: [39, 46, 55, 65, 71],
        },
        {
          x: 'Jan 2019',
          y: [29, 31, 35, 39, 44],
        },
        {
          x: 'Jan 2020',
          y: [41, 49, 58, 61, 67],
        },
        {
          x: 'Jan 2021',
          y: [54, 59, 66, 71, 88],
        },
      ],
    },
  ]

  return (
    <Stack spacing={3} sx={{ px: 1, maxWidth: '376px' }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Info
          </Typography>
          <Typography variant="body1">{user.name}</Typography>
          <Typography
            color="text.secondary"
            component={'span'}
            variant="caption"
            gutterBottom
          >
            {_.upperFirst(user.profile?.status) || 'Inactive'} Status Status
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Chip clickable color="info" label={user.email || 'unknown'} />
          </Box>
        </CardContent>
        <CardActions>
          <Button fullWidth variant="contained">
            Log
          </Button>
          <Button variant="outlined">Notes</Button>
        </CardActions>
      </Card>
      <Card>
        <Alert>
          <Typography
            sx={{
              fontSize: '12px !important',
            }}
          >
            Client :{' '}
            {
              // @ts-ignore
              user.client?.name
            }
          </Typography>
          <Typography
            sx={{
              fontSize: '12px !important',
            }}
          >
            Country :{' '}
            {
              // @ts-ignore
              user.country?.name
            }
          </Typography>
          <Typography
            sx={{
              fontSize: '12px !important',
            }}
          >
            Title : {user.profile?.title}
          </Typography>
          <Typography
            sx={{
              fontSize: '12px !important',
            }}
          >
            Monitoring Experience : {user.profile?.monitoring} year
          </Typography>
        </Alert>
      </Card>
      <Card sx={{ p: 1 }}>
        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="boxPlot"
            height={350}
          />
        </div>
        {radarStatus === 0 ? null : (
          <DomainPerformance
            domains={domains}
            userBaseline={userBaseline}
            userFollowups={radarStatus === 2 ? userFollowups : []}
          />
        )}
      </Card>
    </Stack>
  )
})

type DomainPerformanceProps = {
  userBaseline: UserSimulation
  userFollowups: UserSimulation[]
  domains: IDomain[]
}

const DomainPerformance = observer((props: DomainPerformanceProps) => {
  const { userBaseline, userFollowups, domains } = props

  const getChartSeriesData = (scoreByDomains: ScoreByDomain[]) => {
    return domains.map((_domain) => {
      return (
        scoreByDomains?.find((_score) => _score.domainId === _domain._id)
          ?.score || 0
      )
    })
  }

  const getFollowupSeries = () => {
    return userFollowups
      .filter(
        (_userFollowup) =>
          _userFollowup.status !== UserSimulationStatus.HasNotAssigned
      )
      .map((_userFollowup) => {
        return {
          name: _userFollowup.simulationId,
          data: getChartSeriesData(_userFollowup?.results?.scoreByMainDomain),
        }
      })
  }

  var options = {
    series: [
      {
        name: 'Baseline Data',
        data: getChartSeriesData(userBaseline?.results?.scoreByMainDomain),
      },
      ...getFollowupSeries(),
    ],
    chart: {
      height: 350,
      type: 'radar',
    },
    title: {
      text: 'Domain Performance',
    },
    xaxis: {
      categories: domains.map((domain) => domain.name),
    },
  }

  return (
    <ReactApexChart
      type="radar"
      // @ts-ignore
      options={options}
      series={options.series}
      height={350}
    />
  )
})
