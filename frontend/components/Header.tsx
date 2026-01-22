'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'
import LanguageSelector from './LanguageSelector'

function Header() {
  const { t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Detectar scroll para mudar estilo do header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-2.5'
          : 'bg-white py-3 shadow-sm'
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#inicio" 
            className="flex items-center space-x-2.5 hover:opacity-90 transition group"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-red-600 shadow-md group-hover:shadow-lg transition">
                <Image
                  src="/images/foto perfil.jpeg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-red-600">
                {t('header.logo.name')}
              </span>
              <span className="text-[10px] text-gray-500 font-medium hidden sm:block">
                {t('header.logo.subtitle')}
              </span>
            </div>
          </a>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center space-x-1">
            <li>
              <a
                href="#inicio"
                className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium relative group"
              >
                {t('header.nav.home')}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all group-hover:w-3/4"></span>
              </a>
            </li>
            <li>
              <a
                href="#sobre"
                className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium relative group"
              >
                {t('header.nav.about')}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all group-hover:w-3/4"></span>
              </a>
            </li>
            <li>
              <a
                href="#projetos"
                className="px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium relative group"
              >
                {t('header.nav.projects')}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-red-600 transition-all group-hover:w-3/4"></span>
              </a>
            </li>
            <li className="ml-2">
              <a
                href="#contato"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-md hover:shadow-lg font-semibold transform hover:scale-105"
              >
                {t('header.nav.contact')}
              </a>
            </li>
            <li className="ml-2">
              <LanguageSelector />
            </li>
          </ul>

          {/* Botão Mobile */}
          <div className="lg:hidden flex items-center space-x-2">
            <LanguageSelector />
            <button
              className={`p-2.5 rounded-lg transition ${
                isMenuOpen 
                  ? 'text-white bg-red-600' 
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile (Slide down) */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-lg border border-red-100 p-4 space-y-1">
            <a
              href="#inicio"
              className="block py-3 px-4 text-base text-gray-700 hover:text-white hover:bg-red-600 rounded-lg transition font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.nav.home')}
            </a>
            <a
              href="#sobre"
              className="block py-3 px-4 text-base text-gray-700 hover:text-white hover:bg-red-600 rounded-lg transition font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.nav.about')}
            </a>
            <a
              href="#projetos"
              className="block py-3 px-4 text-base text-gray-700 hover:text-white hover:bg-red-600 rounded-lg transition font-semibold"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.nav.projects')}
            </a>
            <a
              href="#contato"
              className="block py-3 px-4 text-base bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition font-semibold text-center mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('header.nav.contact')}
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
