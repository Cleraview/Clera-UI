import { forwardRef, Fragment, type PropsWithChildren } from 'react'
import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { type VariantProps } from 'class-variance-authority'
import { Badge, BadgeProps } from '../badge'
import { cn } from '@/utils/tailwind'
import { extractSlots } from '@/utils/slots'
import { styles, textHeadingSizeMap, textSizeMap } from './styles'

// Re-export for backward compatibility with stories
export { textHeadingSizeMap, textSizeMap }

type TextHeadingSizeMap = typeof textHeadingSizeMap
type TextSizeMap = typeof textSizeMap
type TextHeadingSizeKeys = keyof TextHeadingSizeMap
type TextSizeKeys = keyof TextSizeMap

type TextSizes = 'description' | 'footerAction'
type ExcludeVariants = 'titleSize' | 'descriptionSize' | 'footerActionSize'
export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof styles.card>, ExcludeVariants> {
  title?: string
  description?: string
  thumbnail?: StaticImageData
  thumbnailMeta?: string
  thumbnailSize?: Pick<StaticImageData, 'width' | 'height'>
  link?: string
  footerActionLabel?: string
  metaItems?: string[]
  badge?: Pick<BadgeProps, 'size' | 'variant'> & {
    label: string
  }
  textSize?: Partial<{
    [key in TextSizes]: TextSizeKeys
  }> & {
    title: TextHeadingSizeKeys
  }
}

export const CardComponent = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      roundedSize = 'md',
      padding = 'md',
      shadow = 'none',
      contentSpacing = 'sm',
      paddingAxis = 'y',
      title,
      textSize,
      description,
      thumbnail,
      thumbnailMeta,
      thumbnailSize,
      thunmbnailRoundedSize,
      badge,
      link,
      metaItems,
      footerActionLabel,
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
      title: titleSize = 'lg',
      footerAction: footerActionSize = 'sm',
      description: descriptionSize = 'md',
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
            <div className={styles.card({ contentSpacing })}>
              {badge?.label && (
                <Badge
                  size={badge.size}
                  variant={badge.variant ?? 'ghost'}
                  className="p-0! text-ds-primary!"
                >
                  {badge.label}
                </Badge>
              )}

              {(title || description) && (
                <div className={styles.titleDescriptionContainer}>
                  {title && (
                    <h1
                      className={cn(styles.card({ titleSize }), styles.title)}
                    >
                      {title}
                    </h1>
                  )}

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
            </div>

            {(hasMetaItems || footerActionLabel) && (
              <div className={styles.footerContainer}>
                <div
                  className={cn(
                    hasMetaItems &&
                      footerActionLabel &&
                      styles.footerActionWrapper,
                    styles.card({ footerActionSize })
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

                  {footerActionLabel && (
                    <div className={styles.footerActionLabelWrapper}>
                      <p className={styles.footerActionLabel}>
                        {footerActionLabel}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
