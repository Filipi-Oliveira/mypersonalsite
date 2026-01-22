'use client'

import { useState, useRef, useEffect } from 'react'
import { useI18n, type Locale } from '@/lib/i18n/context'

const languages: { code: Locale; flag: string; name: string }[] = [
  { code: 'pt-BR', flag: '🇧🇷', name: 'Português (BR)' },
  { code: 'en-US', flag: '🇺🇸', name: 'English (US)' },
  { code: 'es-ES', flag: '🇪🇸', name: 'Español' },
]

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-50 transition text-gray-700 hover:text-red-600 font-medium"
        aria-label="Select language"
      >
        <span className="text-2xl leading-none">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentLanguage.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden z-[100]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code)
                setIsOpen(false)
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 transition ${
                locale === lang.code
                  ? 'bg-red-50 text-red-600 font-semibold'
                  : 'text-gray-700'
              }`}
            >
              <span className="text-2xl leading-none flex-shrink-0">{lang.flag}</span>
              <span className="text-sm flex-grow">{lang.name}</span>
              {locale === lang.code && (
                <span className="ml-auto text-red-600 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
