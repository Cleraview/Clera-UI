'use client'

import {
  forwardRef,
  useMemo,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type MouseEvent,
} from 'react'
import { GoChevronLeft, GoChevronRight } from 'react-icons/go'
import { FaEllipsis } from 'react-icons/fa6'
import { cn } from '@/utils/tailwind'

type PaginationRange = (number | 'ellipsis')[]

const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: {
  totalCount: number
  pageSize: number
  siblingCount?: number
  currentPage: number
}): PaginationRange => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize)
    const totalPageNumbers = siblingCount + 5

    if (totalPageCount <= totalPageNumbers) {
      return range(1, totalPageCount) as PaginationRange
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    )

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount
      let leftRange = range(1, leftItemCount)

      return [...leftRange, 'ellipsis', totalPageCount] as PaginationRange
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      )
      return [firstPageIndex, 'ellipsis', ...rightRange] as PaginationRange
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [
        firstPageIndex,
        'ellipsis',
        ...middleRange,
        'ellipsis',
        lastPageIndex,
      ] as PaginationRange
    }

    return [] as PaginationRange
  }, [totalCount, pageSize, siblingCount, currentPage])

  return paginationRange
}

const PaginationRoot = forwardRef<HTMLElement, ComponentProps<'nav'>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
)
PaginationRoot.displayName = 'PaginationRoot'

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = forwardRef<HTMLLIElement, ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
  )
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
  size?: 'default' | 'sm' | 'lg'
} & ComponentPropsWithoutRef<'a'>

const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, size = 'default', onClick, ...props }, ref) => {
    const isDisabled =
      props['aria-disabled'] === true || props['aria-disabled'] === 'true'

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        e.preventDefault()
        return
      }
      onClick?.(e)
    }

    return (
      <a
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        onClick={handleClick}
        className={cn(
          'flex items-center justify-center rounded-md text-body-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ds-brand/20 select-none',
          'text-ds-default',
          size === 'default' && 'h-9 w-9',
          size === 'sm' && 'h-8 w-8 text-body-xs',
          size === 'lg' && 'h-10 w-10 text-body-md',
          isActive &&
            'bg-ds-selected-bold text-ds-inverse dark:text-ds-default cursor-default',
          isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          !isActive && !isDisabled && 'hover:bg-ds-neutral-subtle-hovered',
          className
        )}
        {...props}
      />
    )
  }
)
PaginationLink.displayName = 'PaginationLink'

const PaginationEllipsis = forwardRef<HTMLSpanElement, ComponentProps<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        'flex h-9 w-9 items-center justify-center text-ds-subtle',
        className
      )}
      {...props}
    >
      <FaEllipsis className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export interface PaginationProps extends ComponentPropsWithoutRef<
  typeof PaginationRoot
> {
  currentPage: number
  totalCount: number
  pageSize?: number
  siblingCount?: number
  onPageChange?: (page: number) => void
  previousLabel?: ReactNode
  nextLabel?: ReactNode
  disabled?: boolean
}

const Pagination = ({
  currentPage,
  totalCount,
  pageSize = 10,
  siblingCount = 1,
  onPageChange,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  disabled,
  className,
  ...props
}: PaginationProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    if (!disabled && onPageChange) {
      onPageChange(currentPage + 1)
    }
  }

  const onPrevious = () => {
    if (!disabled && onPageChange) {
      onPageChange(currentPage - 1)
    }
  }

  const handlePageClick = (page: number) => {
    if (!disabled && onPageChange) {
      onPageChange(page)
    }
  }

  const lastPage = paginationRange[paginationRange.length - 1] as number

  return (
    <PaginationRoot className={className} aria-disabled={disabled} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            onClick={onPrevious}
            aria-disabled={currentPage === 1 || disabled}
            className="gap-1 pl-2.5 pr-3 w-auto"
            aria-label="Go to previous page"
          >
            <GoChevronLeft className="h-3.5 w-3.5 mt-[2px]" />
            <span>{previousLabel}</span>
          </PaginationLink>
        </PaginationItem>

        {paginationRange.map((pageNumber, idx) => {
          if (pageNumber === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => handlePageClick(pageNumber as number)}
                aria-disabled={disabled}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationLink
            onClick={onNext}
            aria-disabled={currentPage === lastPage || disabled}
            className="gap-1 pl-3 pr-2.5 w-auto"
            aria-label="Go to next page"
          >
            <span>{nextLabel}</span>
            <GoChevronRight className="h-3.5 w-3.5 mt-[2px]" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}

export {
  Pagination,
  PaginationRoot,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationEllipsis,
}
