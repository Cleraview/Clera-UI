import Link from 'next/link'
import DefaultBrandLogo from '@/assets/logo/brand/brand-logo.svg'
import ConsoleBrandLogo from '@/assets/logo/brand/brand-console-logo.svg'

export type BrandLogoProps = {
  variant?: 'default' | 'console'
}

export const BrandLogo = ({ variant = 'default' }: BrandLogoProps) => {
  return (
    <Link href={'/'} aria-label="brand logo">
      {variant === 'default' ? (
        <DefaultBrandLogo className="w-24 md:w-32" />
      ) : (
        <ConsoleBrandLogo className="w-24 md:w-32" />
      )}
    </Link>
  )
}
