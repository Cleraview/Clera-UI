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
import { styles } from './styles'

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
      className={cn(styles.root, className)}
      {...props}
    />
  )
)
PaginationRoot.displayName = 'PaginationRoot'

const PaginationContent = forwardRef<HTMLUListElement, ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn(styles.content, className)} {...props} />
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
          styles.linkBase,
          styles.linkTextDefault,
          size === 'default' && styles.linkSizeDefault,
          size === 'sm' && styles.linkSizeSm,
          size === 'lg' && styles.linkSizeLg,
          isActive && styles.linkActive,
          isDisabled ? styles.linkDisabled : 'cursor-pointer',
          !isActive && !isDisabled && styles.linkHover,
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
      className={cn(styles.ellipsis, className)}
      {...props}
    >
      <FaEllipsis className={styles.ellipsisIcon} />
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
            className={cn(styles.linkPrevExtra)}
            aria-label="Go to previous page"
          >
            <GoChevronLeft className={styles.chevronIcon} />
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
            className={cn(styles.linkNextExtra)}
            aria-label="Go to next page"
          >
            <span>{nextLabel}</span>
            <GoChevronRight className={styles.chevronIcon} />
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
