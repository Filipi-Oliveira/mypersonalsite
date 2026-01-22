'use client'

import Header from '@/components/Header'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'

export default function Home() {
  const { t } = useI18n()
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main>
        {/* Seção Início - Hero */}
        <section id="inicio" className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-white via-red-50/30 to-white">
          <div className="max-w-6xl w-full">
            <div className="text-center space-y-8">
              {/* Foto de Perfil */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-red-600 shadow-2xl ring-4 ring-red-100 animate-fade-in">
                    <Image
                      src="/images/foto perfil.jpeg"
                      alt="Foto de Perfil"
                      width={224}
                      height={224}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-red-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                    <span className="text-white text-xl">✨</span>
                  </div>
                </div>
              </div>

              {/* Título Principal */}
              <div className="space-y-4 animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                  {t('home.title')}
                  <span className="block mt-2 text-red-600">{t('home.subtitle')}</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                  {t('home.description')}
                </p>
              </div>

              {/* Cards de Tecnologias */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12">
                {[
                  { key: 'nextjs', icon: '⚡' },
                  { key: 'react', icon: '⚛️' },
                  { key: 'typescript', icon: '📘' },
                  { key: 'tailwind', icon: '🎨' },
                ].map((tech, index) => (
                  <div
                    key={tech.key}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-red-100 hover:border-red-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl mb-2">{tech.icon}</div>
                    <p className="font-bold text-red-600 text-lg">{t(`tech.${tech.key}`)}</p>
                  </div>
                ))}
              </div>

              {/* Botão CTA */}
              <div className="pt-8">
                <a
                  href="#sobre"
                  className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg transform hover:scale-105"
                >
                  {t('home.cta')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Sobre */}
        <section id="sobre" className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
          <div className="max-w-4xl w-full">
            <div className="text-center space-y-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                  {t('about.title')} <span className="text-red-600">{t('about.highlight')}</span>
                </h2>
                <div className="w-32 h-1.5 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full mb-8"></div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-white p-8 md:p-12 rounded-2xl shadow-lg border border-red-100">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                  {t('about.paragraph1')}
                </p>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  {t('about.paragraph2')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção Projetos */}
        <section id="projetos" className="min-h-screen flex items-center justify-center px-4 py-20 bg-gradient-to-b from-white to-red-50/30">
          <div className="max-w-6xl w-full space-y-12">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                {t('projects.title')} <span className="text-red-600">{t('projects.highlight')}</span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full mb-8"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 transform hover:-translate-y-2"
                >
                  <div className="w-full h-52 bg-gradient-to-br from-red-100 via-red-50 to-white rounded-xl mb-6 flex items-center justify-center">
                    <span className="text-6xl">🚀</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('projects.project')} {item}</h3>
                  <p className="text-gray-600 mb-4">
                    {t('projects.description')}
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {t('tech.react')}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      {t('tech.typescript')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção Contato */}
        <section id="contato" className="min-h-screen flex items-center justify-center px-4 py-20 bg-white">
          <div className="max-w-4xl w-full text-center space-y-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                {t('contact.title')} <span className="text-red-600">{t('contact.highlight')}</span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-red-600 to-red-400 mx-auto rounded-full mb-8"></div>
            </div>
            <p className="text-xl text-gray-600 mb-12">
              {t('contact.description')}
            </p>
            <div className="bg-gradient-to-br from-red-50 to-white p-10 rounded-2xl shadow-xl border border-red-100">
              <a
                href="https://www.linkedin.com/in/filipi-bento-de-oliveira-122bb611b/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <p className="text-xl text-gray-800 font-medium">
                  {t('contact.linkedin')}
                </p>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
