import React, { useState, useLayoutEffect, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { MouseEvent } from 'react'
import { useStorybookApi, useStorybookState } from 'storybook/manager-api'
import {
  FiMoon,
  FiSun,
  FiMonitor,
  FiChevronDown,
  FiSidebar,
  FiSliders,
  FiSearch,
} from 'react-icons/fi'
import { FaGithub } from 'react-icons/fa'
import { light, dark } from '../theme'
import { SearchPalette } from './SearchPalette'
import { cn } from '@clera/ui/utils'

export const ADDON_ID = 'custom-header'
export const TOOL_ID = `${ADDON_ID}/tool`

type ThemeMode = 'light' | 'dark' | 'system'

const THEME_MODES: { mode: ThemeMode; label: string; Icon: typeof FiSun }[] = [
  { mode: 'light', label: 'Light', Icon: FiSun },
  { mode: 'dark', label: 'Dark', Icon: FiMoon },
  { mode: 'system', label: 'System', Icon: FiMonitor },
]

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

const resolveDark = (mode: ThemeMode) =>
  mode === 'dark' || (mode === 'system' && prefersDark())

export const ManagerHeader = () => {
  const api = useStorybookApi()
  const state = useStorybookState() as unknown as { viewMode?: string }
  const [ currentStoryId, setCurrentStoryId ] = useState<string | null>(null)
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    () => (window.localStorage.getItem('themeMode') as ThemeMode) || 'system'
  )
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)

  const navMenus = useMemo(() => [
    // { label: 'Docs', url: 'overview--docs' },
    // { label: 'Foundation', url: 'foundation--docs' },
    // { label: 'Components', url: 'components--docs' },
    // { label: 'Changelog', url: 'changelog--docs' },
  ], [])

  const [searchOpen, setSearchOpen] = useState(false)
  const [navHidden, setNavHidden] = useState<boolean>(() => {
    try {
      const stored = window.localStorage.getItem('sidebarCollapsed')
      if (stored === 'true') return true
      if (stored === 'false') return false
    } catch {}
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches
    )
  })
  const [panelOpen, setPanelOpen] = useState(false)
  const isMac =
    typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

  const viewModeRef = useRef(state.viewMode)
  viewModeRef.current = state.viewMode

  const applyTheme = (mode: ThemeMode) => {
    const isDark = resolveDark(mode)
    api.setOptions({ theme: isDark ? dark : light })
    try {
      window.localStorage.setItem('themeMode', mode)
      window.localStorage.setItem('theme', isDark ? 'dark' : 'light')
      if (isDark) document.documentElement.setAttribute('data-theme', 'dark')
      else document.documentElement.removeAttribute('data-theme')
    } catch (e) {}
  }

  const onSelectTheme = (mode: ThemeMode) => {
    setThemeMode(mode)
    applyTheme(mode)
    setThemeMenuOpen(false)
  }

  const onNavClick = (storyId: string) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    api.selectStory(storyId)
    setCurrentStoryId(storyId)
  }

  const isMobile = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches

  const onToggleNav = () => {
    setNavHidden(h => {
      const next = !h
      try {
        window.localStorage.setItem('sidebarCollapsed', String(next))
      } catch {}
      return next
    })
  }

  const onTogglePanel = () => {
    if (isMobile()) setPanelOpen(o => !o)
    else api.togglePanel()
  }

  useLayoutEffect(() => {
    applyTheme(themeMode)
  }, [])

  useEffect(() => {
    if (themeMode !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [themeMode])

  useEffect(() => {
    const { storyId } = api.getUrlState()
    setCurrentStoryId(storyId as string)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('clera-nav-hidden', navHidden)
  }, [navHidden])

  useEffect(() => {
    document.body.classList.toggle('clera-panel-open', panelOpen)
  }, [panelOpen])

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem('sidebarCollapsed')
    } catch {}
    if (stored != null) return
    if (isMobile()) setNavHidden(true)
  }, [])

  useEffect(() => {
    const onDocClick = (e: globalThis.MouseEvent) => {
      if (!isMobile()) return
      const target = e.target as HTMLElement | null
      if (target && target.closest('.sidebar-container a')) setNavHidden(true)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const inField =
        !!target &&
        (/^(input|textarea|select)$/i.test(target.tagName) ||
          target.isContentEditable)
      const isSearch =
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') ||
        (e.key === '/' && !inField)
      if (isSearch) {
        e.preventDefault()
        e.stopPropagation()
        setSearchOpen(true)
        return
      }
      const isControls =
        !inField &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        e.key.toLowerCase() === 'a' &&
        viewModeRef.current === 'story'
      if (isControls) {
        e.preventDefault()
        e.stopPropagation()
        if (isMobile()) setPanelOpen(o => !o)
        else api.togglePanel()
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [])

  return (
    <div className="manager-header">
      {typeof document !== 'undefined' &&
        createPortal(
          <button
            className="icon-button sidebar-toggle-handle"
            onClick={onToggleNav}
            title="Toggle sidebar"
            aria-label="Toggle sidebar"
          >
            {FiSidebar && <FiSidebar className="header-icon" />}
          </button>,
          document.body
        )}

      {typeof document !== 'undefined' &&
        !navHidden &&
        createPortal(
          <div
            className="clera-nav-backdrop"
            onClick={() => setNavHidden(true)}
            aria-hidden="true"
          />,
          document.body
        )}

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="manager-header-wrapper">
        <div className="left-section">
          <div className="brand-logo-container">
            <img src="/brand-logo-ui.png" alt="Logo" className="brand-logo" />
          </div>

          <nav className="nav-menu">
            {navMenus.map((navMenu, index) => (
              <button 
                onClick={onNavClick(navMenu.url)} 
                className={cn("nav-button", navMenu.url === currentStoryId && 'active')}
              >
                {navMenu.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="right-section">
          <button
            type="button"
            className="search-trigger"
            onClick={() => setSearchOpen(true)}
            aria-label="Search stories"
          >
            <FiSearch className="search-icon" aria-hidden="true" />
            <span className="search-trigger-label">Search...</span>
            <span className="search-kbd" aria-hidden="true">
              {isMac ? '⌘K' : 'Ctrl K'}
            </span>
          </button>

          <div className="divider" aria-hidden="true" />

          <a
            href="https://github.com/Cleraview/Clera-UI"
            target="_blank"
            rel="noreferrer noopener"
            className="icon-link"
            title="Repository"
          >
            {FaGithub && <FaGithub className="icon-github" />}
          </a>

          {/* <div className="star-badge" title="Stars">
            <FaStar className="star-icon" />
            <span className="star-value">1.2k</span>
          </div> */}

          {state.viewMode === 'story' && (
            <button
              className="control-toggle"
              onClick={onTogglePanel}
              title="Toggle controls panel (A)"
              aria-label="Toggle controls panel"
            >
              {FiSliders && <FiSliders className="header-icon" />}
              <span className="control-toggle-label">Controls</span>
              <span className="control-toggle-kbd" aria-hidden="true">
                A
              </span>
            </button>
          )}

          <div className="divider" aria-hidden="true" />

          <div className="theme-dropdown">
            <button
              className="icon-button theme-trigger"
              onClick={() => setThemeMenuOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={themeMenuOpen}
              title="Theme"
            >
              {(() => {
                const Active =
                  THEME_MODES.find(m => m.mode === themeMode)?.Icon ?? FiMonitor
                return <Active className="header-icon" />
              })()}
              {FiChevronDown && <FiChevronDown className="theme-caret" />}
            </button>

            {themeMenuOpen && (
              <>
                <div
                  className="theme-menu-overlay"
                  onClick={() => setThemeMenuOpen(false)}
                />
                <div className="theme-menu" role="menu">
                  {THEME_MODES.map(({ mode, label, Icon }) => (
                    <button
                      key={mode}
                      type="button"
                      role="menuitemradio"
                      aria-checked={themeMode === mode}
                      className={cn(
                        'theme-menu-item',
                        themeMode === mode && 'active'
                      )}
                      onClick={() => onSelectTheme(mode)}
                    >
                      <Icon className="header-icon" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}