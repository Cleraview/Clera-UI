import React from 'react'

type TagTypes = 'status:new' | 'status:beta' | 'status:stable' | 'status:deprecated' | 'status:experimental'
type Badge = {
  [key in TagTypes]: {
    label: string
    style: {
      [key in 'color' | 'backgroundColor' | 'borderColor']: string
    }
  }
}

const badges: Badge  = {
  'status:new': {
    label: 'New',
    style: {
      color: 'var(--text-color-ds-brand)', 
      backgroundColor: 'var(--background-color-ds-brand-subtlest)',
      borderColor: 'var(--border-color-ds-brand)',
    },
  },
  'status:beta': {
    label: 'Beta',
    style: {
      color: 'var(--text-color-ds-warning)', 
      backgroundColor: 'var(--background-color-ds-warning)', 
      borderColor: 'var(--border-color-ds-warning)',
    },
  },
  'status:stable': {
    label: 'Stable',
    style: {
      color: 'var(--text-color-ds-success)', 
      backgroundColor: 'var(--background-color-ds-success)',
      borderColor: 'var(--border-color-ds-success)',
    },
  },
  'status:deprecated': {
    label: 'Deprecated',
    style: {
      color: 'var(--text-color-ds-destructive)', 
      backgroundColor: 'var(--background-color-ds-danger)',
      borderColor: 'var(--border-color-ds-danger)',
    },
  },
  'status:experimental': {
    label: 'Experimental',
    style: {
      color: 'var(--text-color-ds-info)', 
      backgroundColor: 'var(--background-color-ds-info)',
      borderColor: 'var(--border-color-ds-info)',
    },
  },
}

export type SidebarItemProps = {
  tags: string[]
  type: string
  name: string
  children: string[]
  storiesImports: string[]
}

const SidebarItem = ({
  tags,
  children,
  name,
  storiesImports,
  type
}: SidebarItemProps) => {
  let statusBadge = null
  
  if (tags) {
    for (const tag of tags) {
      if (/^v\d/.test(tag)) {
        statusBadge = badges['status:stable']
        statusBadge['label'] = tag
        break
      }
      
      if (badges[tag as TagTypes]) {
        statusBadge = badges[tag as TagTypes]
        break 
      }
    }
  }
  
  if (
    !statusBadge ||
    (['story', 'group', 'root'].includes(type)) ||
    ((type === 'component' && !children?.length)) ||
    ((type === 'docs') && storiesImports?.length)
  ) {
    // console.log(item, children, (type === 'component' && !children?.length))
    return name
  }
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: '8px',
      }}
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {name}
      </span>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {statusBadge && (
          <span
            style={{
              ...statusBadge.style,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px 6px',
              marginRight: '6px',
              fontSize: '10px',
              fontWeight: '600',
              lineHeight: '1',
              textTransform: 'uppercase',
              borderRadius: '4px',
              borderWidth: '1px',
              borderStyle: 'solid',
              whiteSpace: 'nowrap',
            }}
          >
            {statusBadge.label}
          </span>
        )}
      </div>
    </div>
  )
}

export const renderSidebarItem = (props: SidebarItemProps) => <SidebarItem {...props} />