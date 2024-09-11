'use client'

import i18n from './init-client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface I18nProviderProps {
  children: React.ReactNode
  lng: string
  fallbackLng?: string
}

export function I18nProvider({ children, lng, fallbackLng = 'en' }: I18nProviderProps) {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const langParam = searchParams.get('lang')
    if (langParam && (langParam === 'en' || langParam === 'fr' || langParam === 'vi')) {
      i18n.changeLanguage(langParam)
    } else if (lng) {
      i18n.changeLanguage(lng)
    } else {
      i18n.changeLanguage(fallbackLng)
    }
    setMounted(true)
  }, [lng, searchParams])

  if (!mounted) return null

  return children
}