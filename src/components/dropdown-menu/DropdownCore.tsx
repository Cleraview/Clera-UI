import {
  useState,
  useEffect,
  useRef,
  isValidElement,
  cloneElement,
} from 'react'
import type {
  MouseEvent,
  ReactNode,
  ReactElement,
  ComponentPropsWithoutRef,
  Attributes,
} from 'react'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './DropdownPrimitives'
import { cn } from '@/utils/tailwind'
import { elementTextSizes } from '../_core/element-config'
import { styles } from './styles'
import { parseWidth, estimateMenuHeight } from './_lib/utils'
import {
  makeCheckboxClickHandler,
  makeRadioClickHandler,
  makeClickHandler,
  ItemProps,
} from './_lib/handlers'
import { renderRadioGroup } from './RadioGroupRenderer'
import type { DropdownItemDef, DropdownObjectItem } from './_lib/types'

interface MenuState {
  items: DropdownItemDef[]
  title: string
}

interface DropdownProps extends ComponentPropsWithoutRef<
  typeof DropdownMenuRoot
> {
  items: DropdownItemDef[]
  trigger?: ReactNode
  align?: ComponentPropsWithoutRef<typeof DropdownMenuContent>['align']
  width?: string | number
  className?: string
  closeOnSelect?: boolean
  onSelect?: (value: string, item?: DropdownItemDef) => void
  onGroupSelect?: (
    groupId: string,
    value: string,
    item?: DropdownItemDef
  ) => void
}

export const Dropdown = ({
  children,
  trigger,
  items,
  align = 'end',
  width = 240,
  className,
  closeOnSelect = true,
  onSelect,
  onGroupSelect,
  ...props
}: DropdownProps) => {
  const [history, setHistory] = useState<MenuState[]>([
    { title: 'Main', items },
  ])
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  useEffect(
    () =>
      setHistory(prev => {
        const next = [...prev]
        if (next.length > 0) next[0] = { ...next[0], items }
        return next
      }),
    [items]
  )

  const [side, setSide] =
    useState<ComponentPropsWithoutRef<typeof DropdownMenuContent>['side']>(
      'bottom'
    )
  const [alignState, setAlignState] =
    useState<ComponentPropsWithoutRef<typeof DropdownMenuContent>['align']>(
      align
    )
  const contentRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLSpanElement | null>(null)

  const currentLayer = history[history.length - 1]
  const isRoot = history.length === 1

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setHistory([{ title: 'Main', items }])
        setDirection('forward')
      }, 300)
    }
    props.onOpenChange?.(open)
    if (open) {
      const el = triggerRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        const estimated = estimateMenuHeight(
          currentLayer.items?.length ?? 3,
          !isRoot
        )
        setSide(
          spaceBelow < estimated && spaceAbove > spaceBelow ? 'top' : 'bottom'
        )
        const parsedWidth = parseWidth(width)
        const spaceRight = window.innerWidth - rect.left
        const spaceLeft = rect.right
        if (spaceRight >= parsedWidth) setAlignState('start')
        else if (spaceLeft >= parsedWidth) setAlignState('end')
        else setAlignState(align)
      } else {
        setSide('bottom')
        setAlignState(align)
      }
    }
  }

  const navigateToSubmenu = (
    e: MouseEvent | Event,
    subItems: DropdownItemDef[],
    title: string
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('forward')
    setHistory(prev => [...prev, { title, items: subItems }])
  }

  const navigateBack = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('backward')
    setHistory(prev => prev.slice(0, -1))
  }

  const handlersOptions = { closeOnSelect, onSelect, onGroupSelect }
  const makeCheckboxHandler = (
    itemNode: DropdownObjectItem,
    propsObj: ItemProps | undefined
  ) => makeCheckboxClickHandler(itemNode, propsObj, handlersOptions)

  const makeRadioHandler = (
    itemNode: DropdownObjectItem,
    propsObj: ItemProps | undefined
  ) => makeRadioClickHandler(itemNode, propsObj, handlersOptions)

  const makeItemClickHandler = (
    propsObj: ItemProps | undefined,
    itemNode?: DropdownObjectItem
  ) => makeClickHandler(propsObj, itemNode, handlersOptions)

  const renderItem = (item: DropdownItemDef, index: number) => {
    if (typeof item === 'string')
      return <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
    if (isValidElement(item))
      return cloneElement(item as ReactElement, { key: index } as Attributes)
    const {
      type = 'item',
      label,
      icon: Icon,
      shortcut,
      children,
      className,
      ...itemProps
    } = item as DropdownObjectItem
    const key = item.id || index
    if (children && children.length > 0) {
      return (
        <DropdownMenuItem
          key={key}
          className={cn(styles.item, styles.itemWithChildren, className)}
          disabled={itemProps.disabled}
          onClick={e => navigateToSubmenu(e, children, label as string)}
        >
          <div className={styles.itemContent}>
            {Icon && <Icon className={styles.itemIcon} />}
            <span className={cn(elementTextSizes['md'])}>{label}</span>
          </div>
        </DropdownMenuItem>
      )
    }
    switch (type) {
      case 'separator':
        return <DropdownMenuSeparator key={key} className={className} />
      case 'label':
        return (
          <DropdownMenuLabel key={key} className={className}>
            {label}
          </DropdownMenuLabel>
        )
      case 'checkbox':
        return (
          <DropdownMenuCheckboxItem
            key={key}
            className={className}
            checked={(item as DropdownObjectItem).checked}
            onCheckedChange={(item as DropdownObjectItem).onCheckedChange}
            onClick={makeCheckboxHandler(
              item as DropdownObjectItem,
              itemProps as ItemProps
            )}
            onSelect={e => {
              if (!closeOnSelect) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            disabled={itemProps.disabled}
          >
            {label}
          </DropdownMenuCheckboxItem>
        )
      case 'radio':
        return (
          <DropdownMenuRadioItem
            key={key}
            className={className}
            value={(item as DropdownObjectItem).value!}
            checked={(item as DropdownObjectItem).checked}
            onClick={makeRadioHandler(
              item as DropdownObjectItem,
              itemProps as ItemProps
            )}
            onSelect={e => {
              if (!closeOnSelect) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
            disabled={itemProps.disabled}
          >
            {label}
          </DropdownMenuRadioItem>
        )
      default:
        return (
          <DropdownMenuItem
            key={key}
            className={className}
            onClick={makeItemClickHandler(
              itemProps as ItemProps,
              item as DropdownObjectItem
            )}
            disabled={itemProps.disabled}
          >
            {Icon && <Icon className={styles.itemIcon} />}
            <span className={cn(elementTextSizes['md'])}>{label}</span>
            {shortcut && <span className={styles.shortcut}>{shortcut}</span>}
          </DropdownMenuItem>
        )
    }
  }

  const renderLayerItems = (itemsList: DropdownItemDef[]): ReactNode[] => {
    const nodes: ReactNode[] = []
    for (let i = 0; i < itemsList.length; i++) {
      const current = itemsList[i]
      if (typeof current === 'string' || isValidElement(current)) {
        nodes.push(renderItem(current, i))
        continue
      }

      if ((current as DropdownObjectItem).type === 'radio') {
        const { node, nextIndex } = renderRadioGroup({
          itemsList,
          startIndex: i,
          makeRadioHandler,
          onSelect,
          onGroupSelect,
          closeOnSelect,
        })
        if (node) nodes.push(node)
        i = nextIndex - 1
        continue
      }

      nodes.push(renderItem(current as DropdownItemDef, i))
    }

    return nodes
  }

  return (
    <DropdownMenuRoot {...props} onOpenChange={onOpenChange}>
      <span ref={triggerRef} style={{ display: 'inline-block' }}>
        <DropdownMenuTrigger asChild>{trigger ?? children}</DropdownMenuTrigger>
      </span>
      <DropdownMenuContent
        ref={contentRef}
        side={side}
        align={alignState}
        sideOffset={6}
        className={cn(styles.contentPadding, className)}
        style={{ width }}
      >
        <div
          key={currentLayer.title}
          className={cn(
            styles.container,
            direction === 'forward'
              ? ''
              : 'animate-in slide-in-from-left-8 fade-in-0 duration-200'
          )}
        >
          {!isRoot && (
            <div className={styles.header}>
              <button onClick={navigateBack} className={styles.navBackButton}>
                Back
              </button>
              <span className={styles.backTitle}>{currentLayer.title}</span>
            </div>
          )}
          <div className={styles.itemsContainer}>
            {renderLayerItems(currentLayer.items)}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  )
}

export default Dropdown
