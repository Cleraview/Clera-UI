import { useState } from 'react'
import { Tooltip } from '@/components/tooltip'

export const CodeToken = ({ token }: { token: string }) => {
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

  const isCopied = copiedToken === token
  const isTooltipOpen = openTooltip === token

  return (
    <Tooltip
      open={isTooltipOpen}
      onOpenChange={(isOpen: boolean) => {
        if (isOpen) {
          setOpenTooltip(token)
        } else {
          if (copiedToken !== token) {
            setOpenTooltip(null)
          }
        }
      }}
      content={isCopied ? 'Copied!' : 'Copy to clipboard'}
      theme="dark"
      delayDuration={30}
    >
      <code
        onClick={() => handleCopy(token)}
        className="self-start text-body-xs! text-ds-default font-(family-name:--font-code) bg-ds-neutral hover:bg-ds-neutral-hovered border border-ds-default py-[2px] px-space-sm rounded-md cursor-pointer"
      >
        {token}
      </code>
    </Tooltip>
  )
}
