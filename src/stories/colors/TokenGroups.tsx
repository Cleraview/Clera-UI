import { useState } from 'react'
import { Tooltip } from '@/components/tooltip'
import { ColorBox } from './ColorBox'
import type { TokenRecord } from './_utils/resolve-token-vars'

export type TokenGroupsProps = {
  group: TokenRecord[]
  tokenIdx: number
  token: TokenRecord
}

export const TokenGroups = ({ group, tokenIdx, token }: TokenGroupsProps) => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [openTooltip, setOpenTooltip] = useState<string | null>(null)

  const handleCopy = (text: string) => {
    if (typeof navigator === 'undefined') return
    navigator.clipboard.writeText(text)
    setCopiedToken(text)
    setOpenTooltip(text)

    setTimeout(() => {
      setCopiedToken(null)
      setOpenTooltip(currentOpen => (currentOpen === text ? null : currentOpen))
    }, 2000)
  }

  const isLastInGroup = tokenIdx === group.length - 1
  const lightColor = token.light
  const darkColor = token.dark

  const isCopied = copiedToken === token.name
  const isTooltipOpen = openTooltip === token.name

  return (
    <div
      key={token.name}
      className={`grid grid-cols-[1fr_200px_200px] items-stretch py-space-md ${
        isLastInGroup ? 'border-b border-default' : ''
      }`}
    >
      <div className="col-span-1 flex flex-col justify-center text-body-sm px-space-sm">
        <Tooltip
          open={isTooltipOpen}
          onOpenChange={(isOpen: boolean) => {
            if (isOpen) {
              setOpenTooltip(token.name)
            } else {
              if (copiedToken !== token.name) {
                setOpenTooltip(null)
              }
            }
          }}
          content={isCopied ? 'Copied!' : 'Copy to clipboard'}
          theme="dark"
          delayDuration={30}
        >
          <code
            onClick={() => handleCopy(token.name)}
            className="self-start text-body-xs! text-default font-(family-name:--font-code) bg-neutral hover:bg-neutral-hovered border border-default py-[2px] px-space-sm rounded-md cursor-pointer"
          >
            {token.name}
          </code>
        </Tooltip>
        <span className="block">{token.description}</span>
      </div>

      <div className="col-span-1 flex flex-col justify-start items-center gap-space-sm px-space-sm">
        <ColorBox
          color={lightColor}
          value={token.lightBase ?? token.light}
          theme="light"
        />
      </div>

      <div className="col-span-1 flex flex-col justify-start items-center gap-space-sm px-space-sm">
        <ColorBox
          color={darkColor}
          value={token.darkBase ?? token.dark}
          theme="dark"
        />
      </div>
    </div>
  )
}
