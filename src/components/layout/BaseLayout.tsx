import { Fragment, PropsWithChildren } from 'react'
import { styles } from './styles'

export const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Fragment>
      <main className={styles.baseMain}>{children}</main>
    </Fragment>
  )
}
