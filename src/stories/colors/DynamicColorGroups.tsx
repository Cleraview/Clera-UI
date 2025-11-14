import { Fragment } from 'react'
import { TokenGroups } from './TokenGroups'
import { useColorTokens } from './_hooks/useColorTokens'

type DynamicColorGroupsProps = {
  groupKey: string
  prefix: string
}

export const DynamicColorGroups = ({ groupKey }: DynamicColorGroupsProps) => {
  const { tokenGroups, loading } = useColorTokens(groupKey)

  if (loading) return <div>Loading tokens...</div>

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="">
          <div className="grid grid-cols-[1fr_200px_200px] border-b border-default">
            <div className="font-semibold py-space-sm px-space-sm">
              Token & Description
            </div>
            <div className="font-semibold py-space-sm px-space-sm justify-self-center">
              Light
            </div>
            <div className="font-semibold py-space-sm px-space-sm justify-self-center">
              Dark
            </div>
          </div>

          {tokenGroups.map((group, groupIdx) => (
            <Fragment key={`group-${groupIdx}`}>
              {group.map((token, tokenIdx) => (
                <TokenGroups
                  key={tokenIdx}
                  group={group}
                  token={token}
                  tokenIdx={tokenIdx}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
