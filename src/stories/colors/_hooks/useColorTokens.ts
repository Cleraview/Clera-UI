import { useState, useEffect, useMemo } from 'react'
import resolveAllColorTokens, {
  DynamicToken,
} from '../_utils/resolve-token-vars'

const SUFFIX_PRIORITY: Record<string, number> = {
  subtlest: 0,
  subtler: 1,
  subtle: 2,
  base: 3,
  bold: 4,
  bolder: 5,
  boldest: 6,
}

function getTokenPriority(name: string) {
  for (const suffix of Object.keys(SUFFIX_PRIORITY)) {
    if (suffix === 'base') continue

    if (name.endsWith(`-${suffix}`)) {
      return {
        root: name.slice(0, -suffix.length - 1),
        priority: SUFFIX_PRIORITY[suffix],
      }
    }
  }

  return {
    root: name,
    priority: SUFFIX_PRIORITY['base'],
  }
}

export function useColorTokens(filteredGroupKey: string = 'all') {
  const [allTokens, setAllTokens] = useState<DynamicToken[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const resolvedTokens = resolveAllColorTokens()
      setAllTokens(resolvedTokens)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const tokenGroups = useMemo(() => {
    if (!allTokens) return []

    const filteredTokens =
      filteredGroupKey === 'all'
        ? allTokens
        : allTokens.filter(token => {
            const searchGroupKey = filteredGroupKey.toLowerCase()

            if (
              searchGroupKey === 'background' &&
              (token.name.includes('elevation') ||
                token.varName.includes('elevation'))
            ) {
              return false
            }

            return (
              token.name.toLowerCase().startsWith(`${searchGroupKey}-`) ||
              token.name.toLowerCase().includes(searchGroupKey) ||
              token.varName.toLowerCase().includes(`-${searchGroupKey}-`) ||
              token.varName.toLowerCase().includes(`-${searchGroupKey}`)
            )
          })

    const groupedTokensMap = new Map<string, DynamicToken[]>()

    for (const token of filteredTokens) {
      const tokenBaseName = token.name.replace(/-(pressed|hovered)$/, '')

      if (!groupedTokensMap.has(tokenBaseName)) {
        groupedTokensMap.set(tokenBaseName, [])
      }
      const tokenGroup = groupedTokensMap.get(tokenBaseName)!

      if (token.name === tokenBaseName) {
        tokenGroup.unshift(token)
      } else {
        tokenGroup.push(token)
      }
    }

    const unsortedTokenGroups = Array.from(groupedTokensMap.values())

    return unsortedTokenGroups.sort((tokenGroupA, tokenGroupB) => {
      const nameA = tokenGroupA[0].name
      const nameB = tokenGroupB[0].name

      const infoA = getTokenPriority(nameA)
      const infoB = getTokenPriority(nameB)

      const rootComparison = infoA.root.localeCompare(infoB.root)
      if (rootComparison !== 0) return rootComparison

      return infoA.priority - infoB.priority
    })
  }, [allTokens, filteredGroupKey])

  return { tokenGroups, loading: isLoading }
}
