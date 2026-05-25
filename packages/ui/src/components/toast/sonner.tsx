import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md'
import type { ElementVariant } from '@/components/_core/element-config'
import { toastStyles } from './styles'
import type { ExternalToast as SonnerOptionsType } from 'sonner'
import { toast as sonnerToast, Toaster } from 'sonner'
import { Toast, type ToastActionPlacement } from './Toast'
import { Button } from '@/components/button'
import { cn } from '@/utils'

const MAX_ACTIONS = 3

export type SonnerWrapperOptions = {
  description?: React.ReactNode
  action?: { label: string; onClick?: () => void }
  duration?: number
  variant?: ElementVariant
  icon?: React.ReactNode
} & Partial<Pick<SonnerOptionsType, 'id'>>

export function showSonnerToast(
  title: React.ReactNode,
  opts?: SonnerWrapperOptions
) {
  const options: Partial<SonnerOptionsType> & {
    classNames?: Record<string, string>
    style?: React.CSSProperties
  } = {
    description:
      opts?.description as unknown as SonnerOptionsType['description'],
    duration: opts?.duration,
  }

  if (opts?.action) {
    options.action = {
      label: opts.action.label,
      onClick: opts.action.onClick ?? (() => {}),
    }
  }

  if (opts && 'id' in opts) options.id = opts.id as SonnerOptionsType['id']

  return sonnerToast(title as Parameters<typeof sonnerToast>[0], options)
}

export const toast = showSonnerToast

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export const SonnerToaster: React.FC<{
  richColors?: boolean
  position?: ToastPosition
}> = ({ richColors = false, position = 'bottom-right' }) => {
  const classNames: Record<string, string> = {
    // title: toastStyles.title,
    description: toastStyles.description,
    actionButton: toastStyles.action,
    closeButton: toastStyles.close,
  }
  return (
    <Toaster
      position={position}
      toastOptions={{ classNames }}
      richColors={richColors}
    />
  )
}

export type ToastStateContent = {
  title?: React.ReactNode
  description?: React.ReactNode
}

export type CustomToastButton = {
  label: string
  onClick?: () => void | Promise<unknown>
  variant?: ElementVariant
  loading?: ToastStateContent
  success?: ToastStateContent | ((data: unknown) => ToastStateContent)
  error?: ToastStateContent | ((err: unknown) => ToastStateContent)
}

export type CustomToastOptions = {
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: CustomToastButton | CustomToastButton[]
  actionPlacement?: ToastActionPlacement
  button?: CustomToastButton | null
  variant?: ElementVariant
  duration?: number
  position?: ToastPosition
  closable?: boolean
} & Partial<Pick<SonnerOptionsType, 'id'>>

export function customToast(
  title: React.ReactNode,
  opts: CustomToastOptions = {}
) {
  const sonnerOptions: Partial<SonnerOptionsType> = {}
  if (opts.duration !== undefined) sonnerOptions.duration = opts.duration
  else if (opts.action) sonnerOptions.duration = Infinity
  if (opts.id !== undefined) sonnerOptions.id = opts.id
  if (opts.position !== undefined) sonnerOptions.position = opts.position

  const actionsRaw = opts.action
    ? Array.isArray(opts.action)
      ? opts.action
      : [opts.action]
    : []
  if (actionsRaw.length > MAX_ACTIONS) {
    console.warn(
      `[Toast] At most ${MAX_ACTIONS} actions are supported; extras will be ignored.`
    )
  }
  const actions = actionsRaw.slice(0, MAX_ACTIONS)

  const handleAction = async (
    id: string | number,
    action: CustomToastButton
  ) => {
    const hasAsyncStates = Boolean(
      action.loading || action.success || action.error
    )

    if (!hasAsyncStates) {
      action.onClick?.()
      sonnerToast.dismiss(id)
      return
    }

    if (action.loading) {
      const loading = action.loading
      sonnerToast.custom(
        () => (
          <Toast
            id={id}
            title={loading.title}
            description={loading.description}
            icon={
              <AiOutlineLoading3Quarters
                className="animate-spin"
                aria-label="Loading"
              />
            }
            variant={opts.variant}
            closable={false}
          />
        ),
        { id, duration: Infinity }
      )
    }

    try {
      const result = await Promise.resolve(action.onClick?.())
      if (action.success) {
        const success =
          typeof action.success === 'function'
            ? action.success(result)
            : action.success
        sonnerToast.custom(
          () => (
            <Toast
              id={id}
              title={success.title}
              description={success.description}
              icon={<MdCheckCircle aria-label="Success" />}
              variant="success"
              onClose={() => sonnerToast.dismiss(id)}
            />
          ),
          { id, duration: 4000 }
        )
      } else {
        sonnerToast.dismiss(id)
      }
    } catch (err) {
      if (action.error) {
        const errorContent =
          typeof action.error === 'function' ? action.error(err) : action.error
        sonnerToast.custom(
          () => (
            <Toast
              id={id}
              title={errorContent.title}
              description={errorContent.description}
              icon={<MdErrorOutline aria-label="Error" />}
              variant="destructive"
              onClose={() => sonnerToast.dismiss(id)}
            />
          ),
          { id, duration: 4000 }
        )
      } else {
        sonnerToast.dismiss(id)
      }
    }
  }

  return sonnerToast.custom(
    id => (
      <Toast
        id={id}
        title={title}
        description={opts.description}
        icon={opts.icon}
        variant={opts.variant}
        closable={opts.closable}
        actionPlacement={opts.actionPlacement}
        action={
          actions.length > 0 ? (
            <div
              className={cn(
                'flex',
                (opts.actionPlacement === 'left' ||
                  opts.actionPlacement === 'right') &&
                  'flex flex-col',
                'gap-space-xs'
              )}
            >
              {actions.map((btn, i) => (
                <Button
                  key={`${btn.label}-${i}`}
                  size="sm"
                  variant={btn.variant ?? 'light'}
                  onClick={() => handleAction(id, btn)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          ) : undefined
        }
        button={
          opts.button
            ? {
                label: opts.button.label,
                onClick: () => {
                  opts.button?.onClick?.()
                  sonnerToast.dismiss(id)
                },
              }
            : undefined
        }
        onClose={() => sonnerToast.dismiss(id)}
      />
    ),
    sonnerOptions
  )
}

export default showSonnerToast
