import {
  cloneElement,
  createElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type Attributes,
  type MouseEvent,
  type ElementType,
} from 'react'
import { cn } from '@/utils/tailwind'
import type { ContextMenuItemDef } from './types'

type ItemProps = {
  onClick?: (e: MouseEvent<HTMLDivElement> | Event) => void
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

export type RenderItemHelpers = {
  ContextMenuItem: ElementType
  ContextMenuSub: ElementType
  ContextMenuSubTrigger: ElementType
  ContextMenuSubContent: ElementType
  ContextMenuSeparator: ElementType
  ContextMenuLabel: ElementType
  ContextMenuCheckboxItem: ElementType
  ContextMenuRadioItem: ElementType
  GoChevronRight?: ElementType
  styles: Record<string, string>
  nodeHasIcon: (n: ContextMenuItemDef) => boolean
  computeRoundedClass: (itemNode: ContextMenuItemDef, idx: number) => string
  makeCheckboxClickHandler: (
    itemNode: ContextMenuItemDef,
    propsObj?: ItemProps
  ) => (e: MouseEvent<HTMLDivElement> | Event) => void
  makeRadioClickHandler: (
    itemNode: ContextMenuItemDef & { value?: string },
    propsObj?: ItemProps
  ) => (e: MouseEvent<HTMLDivElement> | Event) => void
  makeClickHandler: (
    propsObj?: ItemProps,
    itemNode?: ContextMenuItemDef & { value?: string; groupId?: string }
  ) => (e: MouseEvent<HTMLDivElement> | Event) => void
  cn: typeof cn
}

export default function createRenderItem(helpers: RenderItemHelpers) {
  const {
    ContextMenuItem,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
    ContextMenuSeparator,
    ContextMenuLabel,
    ContextMenuCheckboxItem,
    ContextMenuRadioItem,
    GoChevronRight,
    styles,
    nodeHasIcon,
    computeRoundedClass,
    makeCheckboxClickHandler,
    makeRadioClickHandler,
    makeClickHandler,
    cn,
  } = helpers

  return function renderItem(
    item: ContextMenuItemDef,
    index: number,
    depth = 0,
    siblingHasIcon = false
  ): ReactNode {
    type ItemObject = Exclude<ContextMenuItemDef, string | ReactElement>
    if (typeof item === 'string') {
      return createElement(ContextMenuItem, { key: index }, item)
    }

    if (isValidElement(item)) {
      return cloneElement(item, { key: index } as Attributes)
    }

    const {
      type = 'item',
      label,
      icon: Icon,
      shortcut,
      children,
      className,
      ...itemProps
    } = item
    const key = item.id || index

    if (children && children.length > 0) {
      const subTriggerInner = createElement(
        'div',
        { className: styles.itemInner },
        Icon
          ? createElement(
              'span',
              { className: styles.iconWrapper },
              createElement(Icon as ElementType, { className: styles.itemIcon })
            )
          : null,
        createElement(
          'div',
          {
            className: cn(
              siblingHasIcon ? styles.labelGroup : styles.labelGroupNoPad,
              styles.labelAndChevron
            ),
          },
          createElement('span', null, label),
          GoChevronRight
            ? createElement(GoChevronRight as ElementType, {
                className: styles.chevronSmall,
              })
            : null
        )
      )

      const subTrigger = createElement(
        ContextMenuSubTrigger,
        { className: cn(styles.item, className), disabled: itemProps.disabled },
        subTriggerInner
      )

      const subContentChildren = (() => {
        const hasIcon = children.some(nodeHasIcon)
        return children.map((child, idx) =>
          renderItem(child, idx, depth + 1, hasIcon)
        )
      })()

      const subContent = createElement(
        ContextMenuSubContent,
        null,
        subContentChildren
      )

      return createElement(ContextMenuSub, { key }, subTrigger, subContent)
    }

    switch (type) {
      case 'separator':
        return createElement(ContextMenuSeparator, { key, className })

      case 'label':
        return createElement(ContextMenuLabel, { key, className }, label)

      case 'checkbox': {
        const roundedClass = computeRoundedClass(item, index)

        return createElement(
          ContextMenuCheckboxItem,
          {
            key,
            className: cn(className, roundedClass),
            checked: (item as ItemObject).checked,
            onClick: makeCheckboxClickHandler(
              item as ItemObject & { checked?: boolean },
              itemProps as ItemProps
            ),
            disabled: itemProps.disabled,
          },
          label
        )
      }

      case 'radio':
        return createElement(
          ContextMenuRadioItem,
          {
            key,
            className,
            value: (item as ItemObject).value!,
            checked: (item as ItemObject).checked,
            disabled: itemProps.disabled,
            onClick: makeRadioClickHandler(
              item as ItemObject & { value?: string },
              itemProps as ItemProps
            ),
          },
          label
        )

      case 'item':
      default: {
        const iconNode = Icon
          ? createElement(
              'span',
              { className: styles.iconWrapper },
              createElement(Icon as ElementType, { className: styles.itemIcon })
            )
          : null

        const contentNode = createElement(
          'div',
          {
            className: cn(
              siblingHasIcon ? styles.labelGroup : styles.labelGroupNoPad,
              styles.labelAndShortcut
            ),
          },
          createElement('span', null, label),
          shortcut
            ? createElement('span', { className: styles.shortcut }, shortcut)
            : null
        )

        return createElement(
          ContextMenuItem,
          {
            key,
            className,
            disabled: itemProps.disabled,
            onClick: makeClickHandler(
              itemProps as ItemProps,
              item as ContextMenuItemDef & { value?: string; groupId?: string }
            ),
          },
          iconNode,
          contentNode
        )
      }
    }
  }
}
