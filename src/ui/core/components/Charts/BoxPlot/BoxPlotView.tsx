import SearchInput from 'src/ui/core/components/SearchInput/SearchInput'
import {} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { matchSorter } from 'match-sorter'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { useRootStore } from 'src/stores'
import axios from 'axios'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

function BoxPlotView() {
  const data = {
    series: [
      {
        type: 'boxPlot',
        data: [
          {
            x: 'Baseline',
            y: [0, 35, 49, 62, 98],
          },
          {
            x: 'Followup 1 - Protocol Requirement',
            y: [0, 25, 49, 62, 99],
          },
          {
            x: 'Followup 2 - Source Documentation, CRF, Source-to-CRF Review',
            y: [0, 45, 61, 78, 99],
          },
          {
            x: 'Followup 3 - The Informed Consent Process',
            y: [27, 73, 88, 99, 99],
          },
          {
            x: 'Followup 4 - IRB/IEC Submission and Approval',
            y: [0, 50, 77, 88, 99],
          },
          {
            x: 'Followup 5 - Potential Fraud, Scientific Misconduct and Delegation of Authority',
            y: [0, 38, 62, 81, 99],
          },
        ],
      },
      // {
      //   type: 'scatter',
      //   data: [
      //     { x: 'Followup 3 - The Informed Consent Process', y: 0 },
      //     {
      //       x: 'Followup 3 - The Informed Consent Process',
      //       y: 40,
      //     },
      //   ],
      // },
    ],
  }
  const options: ApexOptions = {
    chart: {
      type: 'boxPlot',
      height: 350,
    },
    title: {
      text: 'Simulation Score Distribution',
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
    xaxis: {
      type: 'category',
      labels: {
        maxHeight: 330,
        rotate: -50,
      },
    },
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={data.series}
        type="boxPlot"
        height={580}
        width={850}
      />
    </div>
  )
}
export default observer(BoxPlotView)
