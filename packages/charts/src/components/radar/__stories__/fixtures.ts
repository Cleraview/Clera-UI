import type { RadarIndicator, RadarSeries } from '../types'

export const skillIndicators: RadarIndicator[] = [
  { name: 'Speed', max: 100 },
  { name: 'Power', max: 100 },
  { name: 'Range', max: 100 },
  { name: 'Comfort', max: 100 },
  { name: 'Safety', max: 100 },
  { name: 'Value', max: 100 },
]

export const vehicleSeries: RadarSeries[] = [
  { name: 'Roadster', data: [92, 88, 54, 62, 70, 45] },
  { name: 'Commuter', data: [58, 52, 88, 84, 90, 82] },
]

export const budgetIndicators: RadarIndicator[] = [
  { name: 'Sales', max: 6500 },
  { name: 'Administration', max: 16000 },
  { name: 'Information Technology', max: 30000 },
  { name: 'Customer Support', max: 38000 },
  { name: 'Development', max: 52000 },
  { name: 'Marketing', max: 25000 },
]

export const budgetSeries: RadarSeries[] = [
  {
    name: 'Allocated budget',
    data: [4200, 3000, 20000, 35000, 50000, 18000],
    variant: 'primary',
  },
  {
    name: 'Actual spending',
    data: [5000, 14000, 28000, 26000, 42000, 21000],
    variant: 'warning',
  },
]
