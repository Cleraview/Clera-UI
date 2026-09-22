import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useStorybookApi, useStorybookState } from 'storybook/manager-api'
import { FiSearch } from 'react-icons/fi'
import { cn } from '@clera/ui/utils'

type IndexEntry = {
  id: string
  type: string
  name: string
  parent?: string
  children?: string[]
}
type Item = { id: string; name: string; description: string; section: string }
type Group = { heading: string; items: Item[] }

const DEFAULT_CAPS: Record<string, number> = { UI: 5, Charts: 3 }
const FALLBACK_CAP = 5

export type SearchPaletteProps = {
  open: boolean
  onClose: () => void
}

export const SearchPalette: React.FC<SearchPaletteProps> = ({
  open,
  onClose,
}) => {
  const api = useStorybookApi()
  const state = useStorybookState() as unknown as {
    index?: Record<string, IndexEntry>
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const allItems = useMemo<Item[]>(() => {
    const index = state.index ?? {}
    const path = (entry: IndexEntry): string[] => {
      const parts: string[] = []
      let cur: IndexEntry | undefined = entry
      while (cur) {
        parts.unshift(cur.name)
        cur = cur.parent ? index[cur.parent] : undefined
      }
      return parts
    }

    const out: Item[] = []
    Object.values(index).forEach(entry => {
      if (entry.type === 'component') {
        const parts = path(entry)
        out.push({
          id: entry.children?.[0] ?? entry.id,
          name: entry.name,
          section: parts[0] ?? 'Other',
          description: parts.join(' / '),
        })
      } else if (entry.type === 'docs') {
        const parent = entry.parent ? index[entry.parent] : undefined
        if (!parent || parent.type !== 'component') {
          const parts = path(entry)
          out.push({
            id: entry.id,
            name: entry.name === 'Docs' ? (parts[parts.length - 2] ?? entry.name) : entry.name,
            section: parts[0] ?? 'Other',
            description: parts.join(' / '),
          })
        }
      }
    })
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index])

  const allGroups = useMemo<Group[]>(() => {
    const map = new Map<string, Item[]>()
    allItems.forEach(it => {
      const arr = map.get(it.section) ?? []
      arr.push(it)
      map.set(it.section, arr)
    })
    return Array.from(map.entries()).map(([heading, items]) => ({
      heading,
      items,
    }))
  }, [allItems])

  const groups = useMemo<Group[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      const order = Object.keys(DEFAULT_CAPS)
      const picked = order
        .map(section => allGroups.find(g => g.heading === section))
        .filter((g): g is Group => Boolean(g))
        .map(g => ({ heading: g.heading, items: g.items.slice(0, DEFAULT_CAPS[g.heading]) }))
      if (picked.length) return picked
      return allGroups.map(g => ({ heading: g.heading, items: g.items.slice(0, FALLBACK_CAP) }))
    }
    return allGroups
      .map(g => ({
        heading: g.heading,
        items: g.items.filter(it =>
          `${it.name} ${it.description}`.toLowerCase().includes(q)
        ),
      }))
      .filter(g => g.items.length > 0)
  }, [allGroups, query])

  const flat = useMemo(() => groups.flatMap(g => g.items), [groups])

  const highlight = (text: string): React.ReactNode => {
    const q = query.trim()
    if (!q) return text
    const lower = text.toLowerCase()
    const ql = q.toLowerCase()
    const out: React.ReactNode[] = []
    let i = 0
    let idx = lower.indexOf(ql)
    while (idx !== -1) {
      if (idx > i) out.push(text.slice(i, idx))
      out.push(
        <mark key={idx} className="clera-search-mark">
          {text.slice(idx, idx + q.length)}
        </mark>
      )
      i = idx + q.length
      idx = lower.indexOf(ql, i)
    }
    if (i < text.length) out.push(text.slice(i))
    return out
  }

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [open])

  useEffect(() => setActive(0), [query])

  const select = (id: string) => {
    api.selectStory(id)
    onClose()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => Math.min(a + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const r = flat[active]
      if (r) select(r.id)
    }
  }

  if (!open) return null

  return createPortal(
    <div className="clera-search-overlay" onMouseDown={onClose}>
      <div
        className="clera-search-dialog"
        role="dialog"
        aria-label="Search documentation"
        onMouseDown={e => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="clera-search-input-row">
          <FiSearch className="clera-search-input-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            className="clera-search-input"
            placeholder="Search documentation"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="clera-search-esc" aria-hidden="true">
            esc
          </span>
        </div>

        <div className="clera-search-list">
          {flat.length === 0 && (
            <div className="clera-search-empty">No results found.</div>
          )}
          {groups.map(group => (
            <div key={group.heading} className="clera-search-group">
              <div className="clera-search-group-heading">{group.heading}</div>
              {group.items.map(item => {
                const idx = flat.findIndex(f => f.id === item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(
                      'clera-search-item',
                      idx === active && 'active'
                    )}
                    onMouseMove={() => setActive(idx)}
                    onClick={() => select(item.id)}
                  >
                    <span className="clera-search-item-name">
                      {highlight(item.name)}
                    </span>
                    <span className="clera-search-item-desc">
                      {highlight(item.description)}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="clera-search-footer">
          <span className="clera-search-hint">
            <kbd className="clera-search-key">↑</kbd>
            <kbd className="clera-search-key">↓</kbd>
            Navigate
          </span>
          <span className="clera-search-hint">
            <kbd className="clera-search-key">↵</kbd>
            Select
          </span>
          <span className="clera-search-hint">
            <kbd className="clera-search-key">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>,
    document.body
  )
}
