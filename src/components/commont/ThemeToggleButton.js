'use client'

import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from 'react-icons/fa'
import { Button } from '../ui/button'

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="rounded-full h-10 w-10"
    >
      {theme === 'light' ? (
        <FaMoon className="h-10 w-10" />
      ) : (
        <FaSun className="h-10 w-10" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default ThemeToggleButton
