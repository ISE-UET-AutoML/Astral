import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeContextValue = {
    theme: Theme;
    toggle: () => void;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    toggle: () => {},
    setTheme: () => {},
})
export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const getSystemPref = (): Theme => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('theme')
        return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : getSystemPref()
    })

    useEffect(() => {
        const root = document.documentElement
        // Ensure only one of the classes is present
        root.classList.remove('dark')
        root.classList.remove('light')
        if (theme === 'dark') root.classList.add('dark')
        else root.classList.add('light')
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        const onChange = () => {
            if (!localStorage.getItem('theme')) setTheme(getSystemPref())
        }
        mq.addEventListener?.('change', onChange)
        return () => mq.removeEventListener?.('change', onChange)
    }, [])

    const value = useMemo(() => ({ theme, setTheme, toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')) }), [theme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

