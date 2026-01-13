import { Badge } from '@/components/badge'
import { cn } from '@/utils/tailwind'
import { spacingTokens } from './spacing-tokens'

export const SpacingList = () => (
  <div className="border border-ds-default rounded-md py-space-md">
    <div className="grid grid-cols-[100px_.5fr_1fr] gap-x-space-4xl items-center px-space-md pb-space-sm border-b border-ds-default font-semibold">
      <div>
        <p>Token name</p>
      </div>
      <div>
        <p>Value</p>
      </div>
      <div>
        <p>Description</p>
      </div>
    </div>
    {spacingTokens.map((token, index) => (
      <div
        key={index}
        className="grid grid-cols-[100px_.5fr_1fr] gap-x-space-4xl items-center last:pb-0 py-space-sm px-space-md last:border-b-0 border-b border-ds-default"
      >
        <Badge
          className="justify-self-start bg-ds-primary-bold border border-ds-default py-space-xs! px-space-sm! font-semibold! font-(--font-code) [&>*]:text-label-sm! [&>*]:text-ds-inverse! dark:[&>*]:text-ds-default!"
          size="xs"
          rounded="full"
        >
          {`${token.name}`}
        </Badge>

        <div className={cn(token.size, 'h-6 bg-ds-brand-bold rounded-sm')} />

        <div>
          <p className="m-0!">{token.description}</p>
        </div>
      </div>
    ))}
  </div>
)
