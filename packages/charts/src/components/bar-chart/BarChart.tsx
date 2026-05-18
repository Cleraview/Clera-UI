'use client'

import React from 'react'
import { type VariantProps } from 'class-variance-authority'
import { cn } from '@clera/ui/utils'
import { styles } from './styles'

export type BarChartDatum = {
  label: string
  value: number
  variant?: VariantProps<typeof styles.bar>['variant']
}

export interface BarChartProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof styles.root> {
  data: BarChartDatum[]
  max?: number
  showValues?: boolean
  formatValue?: (value: number) => string
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  max,
  size,
  showValues = true,
  formatValue = v => String(v),
  className,
  ...props
}) => {
  const ceiling = max ?? Math.max(0, ...data.map(d => d.value))

  return (
    <div
      role="img"
      aria-label="Bar chart"
      className={cn(styles.root({ size }), className)}
      {...props}
    >
      {data.map((datum, i) => {
        const pct =
          ceiling > 0 ? Math.min(100, (datum.value / ceiling) * 100) : 0
        return (
          <div key={`${datum.label}-${i}`} className={styles.row}>
            <span className={styles.label} title={datum.label}>
              {datum.label}
            </span>
            <div
              className={styles.track}
              role="progressbar"
              aria-valuenow={datum.value}
              aria-valuemin={0}
              aria-valuemax={ceiling}
              aria-label={datum.label}
            >
              <span
                className={styles.bar({ variant: datum.variant })}
                style={{ width: `${pct}%` }}
                data-testid="bar-chart-bar"
              />
            </div>
            {showValues && (
              <span className={styles.value}>{formatValue(datum.value)}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

BarChart.displayName = 'BarChart'
