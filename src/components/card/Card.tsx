import { forwardRef, Fragment, type PropsWithChildren } from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { type VariantProps } from 'class-variance-authority'
import { Badge, BadgeProps } from '../badge'
import { cn } from '@/utils/tailwind'
import { extractSlots } from '@/utils/slots'
import { styles, textHeadingSizeMap, textSizeMap } from './styles'

export { textHeadingSizeMap, textSizeMap }

type TextHeadingSizeMap = typeof textHeadingSizeMap
type TextSizeMap = typeof textSizeMap
type TextHeadingSizeKeys = keyof TextHeadingSizeMap
type TextSizeKeys = keyof TextSizeMap

type TextSizes = 'description' | 'footerAction'
type ExcludeVariants = 'titleSize' | 'descriptionSize' | 'footerActionSize'
export interface CardProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    Omit<VariantProps<typeof styles.card>, ExcludeVariants> {
  title?: React.ReactNode
  description?: string
  thumbnail?: StaticImageData
  thumbnailMeta?: string
  thumbnailSize?: Pick<StaticImageData, 'width' | 'height'>
  link?: string | null
  metaItems?: string[]
  badge?: Pick<BadgeProps, 'size' | 'variant'> & {
    label: string
    spacing?: 'xs' | 'sm' | 'md' | 'lg'
  }
  textSize?: Partial<{
    [key in TextSizes]: TextSizeKeys
  }> & {
    title: TextHeadingSizeKeys
  }
  titleSpacing?: 'xs' | 'sm' | 'md' | 'lg'
  contentSpacing?: 'xs' | 'sm' | 'md' | 'lg'
  extended?: React.ReactNode
  footer?: React.ReactNode
  metaLinkLabel?: string
}

export const CardComponent = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      roundedSize = 'md',
      padding = 'sm',
      shadow = 'none',
      titleSpacing = 'sm',
      paddingAxis = 'y',
      contentSpacing = 'sm',
      title,
      textSize,
      description,
      extended,
      thumbnail,
      thumbnailMeta,
      thumbnailSize,
      thunmbnailRoundedSize,
      badge,
      link,
      metaItems,
      footer,
      metaLinkLabel,
      children,
      ...props
    },
    ref
  ) => {
    const { slots } = extractSlots(children, {
      Content: CardContentSlot as React.FC,
      Thumbnail: CardThumbnailSlot as React.FC,
    })

    const hasMetaItems = Boolean(metaItems?.length)
    const hasThumbnail = Boolean(slots.Thumbnail || thumbnail)

    const {
      title: titleSize = 'md',
      footerAction: footerActionSize = 'sm',
      description: descriptionSize = 'sm',
    } = textSize ?? {}

    return (
      <div
        ref={ref}
        className={cn(
          styles.root,
          styles.card({ roundedSize, shadow }),
          !hasThumbnail &&
            padding &&
            styles.card({ padding, paddingAxis: 'all' }),
          className
        )}
        {...props}
      >
        {link && <Link href={link} className={styles.link} />}

        {slots.Thumbnail
          ? slots.Thumbnail
          : thumbnail && (
              <CardThumbnailSlot
                src={thumbnail}
                alt={thumbnailMeta as string}
                roundedSize={
                  shadow !== 'none' ? thunmbnailRoundedSize : roundedSize
                }
                {...thumbnailSize}
              />
            )}

        {slots.Content ? (
          <div className={styles.card({ padding, paddingAxis })}>
            {slots.Content}
          </div>
        ) : (
          <div
            className={cn(
              styles.contentWrapper,
              hasThumbnail && styles.card({ padding, paddingAxis })
            )}
          >
            <div
              className={cn(
                styles.contentInner,
                styles.contentSpacingMap[
                  contentSpacing as keyof typeof styles.contentSpacingMap
                ]
              )}
            >
              {badge?.label && (
                <Badge
                  size={badge.size}
                  variant={badge.variant ?? 'ghost'}
                  className={cn(
                    styles.badgeInline,
                    badge.variant === 'ghost' ? styles.badgeOverride : undefined
                  )}
                >
                  {badge.label}
                </Badge>
              )}

              {(title || description) && (
                <div
                  className={cn(
                    styles.titleSpacingMap[
                      titleSpacing as keyof typeof styles.titleSpacingMap
                    ]
                  )}
                >
                  {title &&
                    (typeof title === 'string' ? (
                      <h1
                        className={cn(styles.card({ titleSize }), styles.title)}
                      >
                        {title}
                      </h1>
                    ) : (
                      title
                    ))}

                  {description && (
                    <p
                      className={cn(
                        styles.card({ descriptionSize }),
                        styles.description
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}

              {extended && <div className={styles.extended}>{extended}</div>}
            </div>

            {(hasMetaItems || metaLinkLabel) && (
              <div className={styles.footerContainer}>
                <div
                  className={cn(
                    styles.card({ footerActionSize }),
                    styles.footerActionWrapper({
                      footerActionSize,
                      hasFooterAction: Boolean(metaLinkLabel && hasMetaItems),
                    })
                  )}
                >
                  {hasMetaItems && (
                    <div className={styles.metaItemsContainer}>
                      {metaItems?.map((item, index) => (
                        <Fragment key={index}>
                          <p>{item}</p>
                          {index !== metaItems.length - 1 && <span>|</span>}
                        </Fragment>
                      ))}
                    </div>
                  )}

                  {metaLinkLabel && (
                    <div className={styles.footerActionLabelWrapper}>
                      <p className={styles.footerActionLabel}>
                        {metaLinkLabel}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {footer && footer}
          </div>
        )}
      </div>
    )
  }
)

export const CardContentSlot: React.FC<PropsWithChildren> = ({ children }) => {
  return children
}

type CardThumbnailSlotProps = Pick<CardProps, 'roundedSize'> & {
  src: StaticImageData
  alt: string
  width?: StaticImageData['width']
  height?: StaticImageData['height']
}

export const CardThumbnailSlot: React.FC<CardThumbnailSlotProps> = ({
  roundedSize,
  ...imageProps
}) => (
  <div className={cn(styles.thumbnailWrapper, styles.card({ roundedSize }))}>
    {}
    <Image className={styles.thumbnailImage} {...imageProps} />
  </div>
)

CardComponent.displayName = 'CardComponent'
