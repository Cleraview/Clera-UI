'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  name: string
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Stories are arbitrary code, so one throwing must not take the whole landing
 * page down with it. Keep the failure inside its own card and name it.
 */
export class StoryBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[charts overview] "${this.props.name}" failed to render`, {
      error,
      info,
    })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="flex h-[220px] flex-col items-center justify-center gap-space-xs p-space-md text-center">
        <p className="m-0! text-body-sm font-semibold text-ds-destructive">
          This story failed to render
        </p>
        <p className="m-0! text-body-sm! text-ds-subtle">{error.message}</p>
      </div>
    )
  }
}
