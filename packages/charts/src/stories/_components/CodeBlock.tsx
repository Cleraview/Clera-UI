'use client'

import { Fragment, type ReactNode } from 'react'

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'default',
  'const',
  'let',
  'return',
  'true',
  'false',
  'null',
  'undefined',
])

const TOKEN = new RegExp(
  [
    '(?<comment>\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)',
    '(?<string>\'[^\']*\'|"[^"]*"|`[^`]*`)',
    '(?<tag><\\/?[A-Z][A-Za-z0-9]*|\\/>|<\\/?>)',
    '(?<prop>[A-Za-z_$][\\w$]*(?=\\s*[:=]))',
    '(?<number>\\b-?\\d+(?:\\.\\d+)?\\b)',
    '(?<word>[A-Za-z_$][\\w$]*)',
  ].join('|'),
  'g'
)

const COLOR: Record<string, string> = {
  comment: 'text-(--text-color-ds-accent-gray) italic',
  string: 'text-(--text-color-ds-accent-green)',
  tag: 'text-(--text-color-ds-accent-blue)',
  prop: 'text-(--text-color-ds-accent-teal)',
  number: 'text-(--text-color-ds-accent-orange)',
  keyword: 'text-(--text-color-ds-accent-violet)',
}

function highlight(line: string): ReactNode {
  const parts: ReactNode[] = []
  let last = 0

  for (const match of line.matchAll(TOKEN)) {
    const groups = match.groups ?? {}
    let kind = Object.keys(groups).find(key => groups[key] !== undefined)
    if (!kind) continue

    // A bare word is only interesting when it's a keyword.
    if (kind === 'word') {
      if (!KEYWORDS.has(match[0])) continue
      kind = 'keyword'
    }

    const start = match.index ?? 0
    if (start > last) parts.push(line.slice(last, start))
    parts.push(
      <span key={start} className={COLOR[kind]}>
        {match[0]}
      </span>
    )
    last = start + match[0].length
  }

  if (last < line.length) parts.push(line.slice(last))
  return parts.map((part, i) => <Fragment key={i}>{part}</Fragment>)
}

export const CodeBlock = ({ code }: { code: string }) => {
  const lines = code.split('\n')

  return (
    <pre className="m-0! overflow-x-auto bg-transparent p-0! text-body-sm [scrollbar-color:color-mix(in_srgb,var(--text-color-ds-subtle)_50%,transparent)_transparent] [scrollbar-width:thin]">
      <code className="grid">
        {lines.map((line, i) => (
          <span key={i} className="grid grid-cols-[2.5rem_1fr] gap-space-sm">
            <span className="select-none px-space-sm text-right text-(--text-color-ds-accent-gray)">
              {i + 1}
            </span>
            <span className="pr-space-md text-ds-default">
              {highlight(line)}
            </span>
          </span>
        ))}
      </code>
    </pre>
  )
}
