import { ColorBox } from './ColorBox'
import { CodeToken } from '../_components/CodeToken'
import type { TokenRecord } from './_utils/resolve-token-vars'

export type TokenGroupsProps = {
  group: TokenRecord[]
  tokenIdx: number
  token: TokenRecord
}

export const TokenGroups = ({ group, tokenIdx, token }: TokenGroupsProps) => {
  const isLastInGroup = tokenIdx === group.length - 1
  const lightColor = token.light
  const darkColor = token.dark

  return (
    <div
      key={token.name}
      className={`grid grid-cols-[1fr_200px_200px] items-stretch py-space-md ${
        isLastInGroup ? 'border-b border-ds-default' : ''
      }`}
    >
      <div className="col-span-1 flex flex-col justify-center text-body-sm px-space-sm">
        <CodeToken token={token.name} />
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
