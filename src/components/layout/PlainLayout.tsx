'use client'

import { Fragment, type PropsWithChildren } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import { extractSlots } from '@/utils/slots'
import { styles } from './styles'

type PlainLayoutProps = PropsWithChildren

const PlainLayoutHeader: React.FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>
}

const PlainLayoutComponent: React.FC<PropsWithChildren> = ({ children }) => {
  const { slots, children: mainContent } = extractSlots(children, {
    Header: PlainLayout.Header,
  })

  return (
    <Fragment>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerContainer}>
            <BrandLogo />
          </div>

          <div className={styles.headerSlots}>{slots.Header}</div>
        </div>
      </header>

      <main className={styles.main}>{mainContent}</main>
    </Fragment>
  )
}

export const PlainLayout =
  PlainLayoutComponent as React.FC<PlainLayoutProps> & {
    Header: typeof PlainLayoutHeader
  }

PlainLayout.Header = PlainLayoutHeader
