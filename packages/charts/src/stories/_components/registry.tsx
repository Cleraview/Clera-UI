import type { ReactNode } from 'react'
import {
  LuChartColumnBig,
  LuChartLine,
  LuChartPie,
  LuChartScatter,
  LuChartArea,
  LuRadar,
  LuLayoutGrid,
  LuColumns3,
  LuTarget,
} from 'react-icons/lu'
import { Combo } from '@/components/combo'

import * as BarStories from '@/components/bar/__stories__/Bar.stories'
import * as ComboStories from '@/components/combo/__stories__/Combo.stories'
import * as LineStories from '@/components/line/__stories__/Line.stories'
import * as LineMatrixStories from '@/components/line-matrix/__stories__/LineMatrix.stories'
import * as LinePanelsStories from '@/components/line-panels/__stories__/LinePanels.stories'
import * as MultiXLineStories from '@/components/multi-x-line/__stories__/MultiXLine.stories'
import * as PieStories from '@/components/pie/__stories__/Pie.stories'
import * as PolarBarStories from '@/components/polar-bar/__stories__/PolarBar.stories'
import * as RadarStories from '@/components/radar/__stories__/Radar.stories'
import * as ScatterStories from '@/components/scatter/__stories__/Scatter.stories'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ChartGroup {
  id: string
  /** Tab label, e.g. `Bar` renders as "Bar Charts". */
  label: string
  /** The JSX tag used in the generated code snippets. */
  component: string
  icon: ReactNode
  /** The story to open in Storybook, e.g. `charts-bar--docs`. */
  docsId: string
  stories: any
}

export const chartGroups: ChartGroup[] = [
  {
    id: 'bar',
    label: 'Bar',
    component: 'Bar',
    icon: <LuChartColumnBig />,
    docsId: 'charts-bar--docs',
    stories: BarStories,
  },
  {
    id: 'line',
    label: 'Line',
    component: 'Line',
    icon: <LuChartLine />,
    docsId: 'charts-line--docs',
    stories: LineStories,
  },
  {
    id: 'combo',
    label: 'Combo',
    component: 'Combo',
    icon: <LuChartArea />,
    docsId: 'charts-combo--docs',
    stories: ComboStories,
  },
  {
    id: 'pie',
    label: 'Pie',
    component: 'Pie',
    icon: <LuChartPie />,
    docsId: 'charts-pie--docs',
    stories: PieStories,
  },
  {
    id: 'scatter',
    label: 'Scatter',
    component: 'Scatter',
    icon: <LuChartScatter />,
    docsId: 'charts-scatter--docs',
    stories: ScatterStories,
  },
  {
    id: 'radar',
    label: 'Radar',
    component: 'Radar',
    icon: <LuRadar />,
    docsId: 'charts-radar--docs',
    stories: RadarStories,
  },
  {
    id: 'polar-bar',
    label: 'Polar Bar',
    component: 'PolarBar',
    icon: <LuTarget />,
    docsId: 'charts-polarbar--docs',
    stories: PolarBarStories,
  },
  {
    id: 'multi-x-line',
    label: 'Multi-axis',
    component: 'MultiXLine',
    icon: <LuColumns3 />,
    docsId: 'charts-multixline--docs',
    stories: MultiXLineStories,
  },
  {
    id: 'line-panels',
    label: 'Panels',
    component: 'LinePanels',
    icon: <LuLayoutGrid />,
    docsId: 'charts-linepanels--docs',
    stories: LinePanelsStories,
  },
  {
    id: 'line-matrix',
    label: 'Matrix',
    component: 'LineMatrix',
    icon: <LuLayoutGrid />,
    docsId: 'charts-linematrix--docs',
    stories: LineMatrixStories,
  },
]

const quarters = ['Q1', 'Q2', 'Q3', 'Q4']

export const featured = {
  title: 'Revenue vs. margin',
  description: 'Quarterly revenue with the margin trend on a second axis.',
  icon: <LuChartColumnBig />,
  docsId: 'charts-combo--docs',
  code: `<Combo
  height={320}
  highlightOnHover
  categories={['Q1', 'Q2', 'Q3', 'Q4']}
  yAxes={[
    { name: 'Revenue (k)' },
    { name: 'Margin (%)', side: 'right' },
  ]}
  series={[
    { name: 'Revenue', type: 'bar', data: [128, 164, 149, 198] },
    { name: 'Margin', type: 'line', yAxis: 1, data: [21, 26, 24, 32] },
  ]}
/>`,
  demo: (
    <Combo
      height={320}
      highlightOnHover
      categories={quarters}
      yAxes={[{ name: 'Revenue (k)' }, { name: 'Margin (%)', side: 'right' }]}
      series={[
        { name: 'Revenue', type: 'bar', data: [128, 164, 149, 198] },
        { name: 'Margin', type: 'line', yAxis: 1, data: [21, 26, 24, 32] },
      ]}
    />
  ),
}
