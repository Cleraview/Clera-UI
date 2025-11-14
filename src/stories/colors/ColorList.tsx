import { SectionShell } from '@/components/layout/sections'
import { DynamicColorGroups } from './DynamicColorGroups'

type ColorListProps = {
  prefix: string
  tokenGroup?: string[]
  groupKey?: string
  tokens?: Record<string, unknown[] | Record<string, unknown>>
}

export const ColorList = ({ prefix, groupKey }: ColorListProps) => {
  return (
    <SectionShell direction="col">
      <div className="space-y-space-md">
        <DynamicColorGroups groupKey={groupKey || 'all'} prefix={prefix} />
      </div>
    </SectionShell>
  )
}
