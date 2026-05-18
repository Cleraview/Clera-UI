import Link from 'next/link'
import DefaultBrandLogo from '@/assets/logo/brand/brand-logo.svg'
import ConsoleBrandLogo from '@/assets/logo/brand/brand-console-logo.svg'
import { styles } from './styles'

export type BrandLogoProps = {
  variant?: 'default' | 'console'
}

export const BrandLogo = ({ variant = 'default' }: BrandLogoProps) => {
  return (
    <Link href={'/'} aria-label="brand logo" className={styles.wrapper}>
      {variant === 'default' ? (
        <DefaultBrandLogo className={styles.svg} />
      ) : (
        <ConsoleBrandLogo className={styles.svg} />
      )}
    </Link>
  )
}
