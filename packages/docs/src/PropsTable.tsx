import React, { Fragment } from 'react'
import { useOf } from '@storybook/addon-docs/blocks'
import { cn } from '@ui/utils/tailwind'

type ArgTypeTable = {
  disable?: boolean
  type?: { summary?: string }
  defaultValue?: { summary?: string }
}

type ArgType = {
  description?: string
  type?: { name?: string; required?: boolean }
  table?: ArgTypeTable
}

type PreparedMetaLike = {
  argTypes?: Record<string, ArgType | undefined>
}

type ResolvedMeta = {
  type: string
  preparedMeta?: PreparedMetaLike
}

type Row = {
  name: string
  description: string
  typeSummary: string
  defaultValue?: string
  required: boolean
}

const RichText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split('`')
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="text-body-xs bg-ds-elevation-surface-sunken rounded-sm px-space-2xs py-px font-(family-name:--font-code)"
          >
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}

function collectRows(argTypes: Record<string, ArgType | undefined>): Row[] {
  return Object.entries(argTypes)
    .filter((entry): entry is [string, ArgType] => {
      const [, argType] = entry
      return Boolean(argType) && !argType?.table?.disable
    })
    .map(([name, argType]) => ({
      name,
      description: argType.description ?? '',
      typeSummary: argType.table?.type?.summary ?? argType.type?.name ?? '',
      defaultValue: argType.table?.defaultValue?.summary,
      required: argType.type?.required ?? false,
    }))
}

export const PropsTable: React.FC = () => {
  const resolved = useOf('meta') as ResolvedMeta
  const argTypes = resolved.preparedMeta?.argTypes ?? {}
  const rows = collectRows(argTypes)

  if (rows.length === 0) return null

  const fieldRowClass =
    'grid grid-cols-[minmax(72px,96px)_1fr] gap-x-space-md gap-y-space-sm'

  return (
    <div className="@container w-full max-w-full text-ds-default flex flex-col gap-y-space-md">
      {rows.map(row => (
        <div key={row.name}>
          <div className="border-b border-ds-default py-space-sm">
            <code
              className={cn(
                'text-body-sm! font-bold! font-(family-name:--font-code) rounded-sm px-space-xs py-1 bg-ds-elevation-surface-sunken'
              )}
            >
              {row.name}
            </code>
            {row.required ? (
              <span className="text-body-xs! font-bold! text-ds-destructive! bg-ds-destructive-bold/10! ml-space-sm! py-[2px]! px-[3px]! rounded-sm">
                required
              </span>
            ) : null}
          </div>

          <div className={cn(fieldRowClass, 'mt-space-sm py-space-sm')}>
            <div className="text-body-sm! text-ds-subtle">Description</div>
            <div className="text-body-sm min-w-0 [overflow-wrap:anywhere]">
              {row.description ? <RichText text={row.description} /> : '-'}
            </div>

            {row.typeSummary ? (
              <>
                <div className="text-body-sm! text-ds-subtle">Type</div>
                <div className="min-w-0 [overflow-wrap:anywhere]">
                  <code className="text-body-xs! font-bold font-(family-name:--font-code) rounded-sm px-space-xs py-1 bg-ds-elevation-surface-sunken">
                    <RichText text={row.typeSummary} />
                  </code>
                </div>
              </>
            ) : null}

            {row.defaultValue !== undefined ? (
              <>
                <div className="text-body-sm! text-ds-subtle">Default</div>
                <div className="min-w-0 [overflow-wrap:anywhere]">
                  <code className="text-body-xs! font-bold font-(family-name:--font-code) rounded-sm px-space-xs py-1 bg-ds-elevation-surface-sunken">
                    <RichText
                      text={row.defaultValue ? row.defaultValue : '-'}
                    />
                  </code>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

PropsTable.displayName = 'PropsTable'
