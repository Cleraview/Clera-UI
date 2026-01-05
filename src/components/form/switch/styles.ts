import { cva } from 'class-variance-authority'
import { cn } from '@root/src/utils/tailwind/tailwind'

export const styles = {
  root: cva(
    'h-7 relative inline-flex cursor-pointer items-center rounded-full transition-colors',
    {
      variants: {
        checked: {
          true: 'bg-ds-selected-bold',
          false: 'bg-ds-neutral-bold',
        },
        disabled: {
          true: 'opacity-50 cursor-not-allowed',
          false: '',
        },
        fixedWidth: {
          true: 'min-w-[50px]',
          false: '',
        },
        hasBothChildren: {
          true: 'min-w-[calc(9px+21px+20px)]',
          false: '',
        },
      },
      defaultVariants: {
        checked: false,
        disabled: false,
        fixedWidth: false,
        hasBothChildren: false,
      },
    }
  ),
  innerContainer: cva(
    cn(
      'w-full h-full text-center text-label-xs font-semibold overflow-hidden',
      'pointer-events-none select-none',
      'transition-padding-inline-start transition-padding-inline-end duration-200 ease-in-out'
    ),
    {
      variants: {
        checked: {
          true: 'ps-[9px] pe-[28px]',
          false: 'ps-[28px] pe-[9px]',
        },
        hasBothChildren: {
          true: '',
          false: '',
        },
      },
      defaultVariants: {
        checked: false,
        hasBothChildren: false,
      },
    }
  ),
  checkedChildren: cva(
    cn(
      'w-full h-full block leading-[28px] text-ds-inverse dark:text-ds-default! [&>*]:inline-flex [&>*]:self-center',
      'transition-margin-inline-start transition-margin-inline-end duration-200 ease-in-out'
    ),
    {
      variants: {
        checked: {
          true: '',
          false:
            'ms-[calc(-100%+calc(10px*2)-calc(24px*2))] me-[calc(100%-calc(10px*2)+calc(24px*2))]',
        },
      },
      defaultVariants: {
        checked: false,
      },
    }
  ),
  unCheckedChildren: cva(
    cn(
      'w-full h-full block mt-[-28px] leading-[28px] text-ds-inverse [&>*]:inline-flex [&>*]:self-center',
      'transition-margin-inline-start transition-margin-inline-end duration-200 ease-in-out'
    ),
    {
      variants: {
        checked: {
          true: 'ms-[calc(100%-calc(4px+2px*2)+calc(24px*2))] me-[calc(-100%+calc(4px+2px*2)-calc(24px*2))]',
          false: 'ms-[0px] me-[0px]',
        },
      },
      defaultVariants: {
        checked: false,
      },
    }
  ),
  thumb: cva(
    'w-5 h-5 absolute bg-ds-input rounded-full shadow transition-all duration-200 ease-in-out',
    {
      variants: {
        checked: {
          true: 'start-[calc(100%-calc(23px))] dark:bg-ds-neutral-bold',
          false: 'start-[3px]',
        },
      },
      defaultVariants: {
        checked: false,
      },
    }
  ),
}
