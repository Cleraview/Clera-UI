import React, { useState, useLayoutEffect, useMemo, useEffect } from 'react'
import type { MouseEvent, ChangeEvent } from 'react'
import { useStorybookApi } from 'storybook/manager-api'
import { FiMoon, FiSun } from 'react-icons/fi'
import { FaGithub, FaStar } from 'react-icons/fa'
import { light, dark } from '../theme'
import { cn } from '../../src/utils'

export const ADDON_ID = 'custom-header'
export const TOOL_ID = `${ADDON_ID}/tool`

export const ManagerHeader = () => {
  const api = useStorybookApi()
  const [ currentStoryId, setCurrentStoryId ] = useState<string | null>(null)
  const [ isDark, setIsDark ] = useState<boolean>(
    window.localStorage.getItem('theme') === 'dark'
  )

  const navMenus = useMemo(() => [
    { label: 'Docs', url: 'overview--docs' },
    { label: 'Foundation', url: 'foundation--docs' },
    { label: 'Components', url: 'components--docs' },
    { label: 'Changelog', url: 'changelog--docs' },
  ], [])

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    api.setOptions({ searchQuery: e.target.value })
  }

  const setThemeForPreview = (isDarkTheme: boolean) => {
    try {
      if (typeof window !== 'undefined') {
        if (isDarkTheme) {
          window.localStorage.setItem('theme', 'dark')
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          window.localStorage.setItem('theme', 'light')
          document.documentElement.removeAttribute('data-theme')
        }
      }
    } catch (e) {}
  }

  const onThemeToggle = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    api.setOptions({
      theme: newIsDark ? dark : light,
    })

    setThemeForPreview(newIsDark)
  }

  const onNavClick = (storyId: string) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    api.selectStory(storyId)
    setCurrentStoryId(storyId)
  }

  useLayoutEffect(() => {
    api.setOptions({ theme: isDark ? dark : light })
    setThemeForPreview(isDark)
  }, [])

  useEffect(() => {
    const { storyId } = api.getUrlState()
    setCurrentStoryId(storyId as string)
  }, [])

  return (
    <div className="manager-header">
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
          {/* <div className="search-container">
            <FiSearch className="search-icon" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={onSearch}
              placeholder="Search stories..."
              className="search-input"
              aria-label="Search stories"
            />
          </div> */}

          {/* <div className="divider" aria-hidden="true" /> */}

          <a
            href="https://github.com/Cleraview/Clera-UI"
            target="_blank"
            rel="noreferrer noopener"
            className="icon-link"
            title="Repository"
          >
            <FaGithub className="icon-github" />
          </a>

          {/* <div className="star-badge" title="Stars">
            <FaStar className="star-icon" />
            <span className="star-value">1.2k</span>
          </div> */}

          <div className="divider" aria-hidden="true" />

          <button className="theme-toggle" onClick={onThemeToggle} aria-pressed={isDark}>
            {isDark ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
          </button>
        </div>
      </div>
    </div>
  )
}