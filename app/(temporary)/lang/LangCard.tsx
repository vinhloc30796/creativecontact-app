"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { I18nProvider } from "@/lib/i18n/i18nProvider"
import { ExternalLink } from "lucide-react"
import { Trans, useTranslation } from 'react-i18next'


export default function LangCard() {
  const { t, i18n } = useTranslation('translation', { keyPrefix: 'LangCard' })

  const toggleLanguage = () => {
    const languages = ['en', 'fr', 'vi'];
    const currentIndex = languages.indexOf(i18n.language);
    const newLang = languages[(currentIndex + 1) % languages.length];
    window.location.search = `lang=${newLang}`
  }

  return (
    <I18nProvider lng={i18n.language} fallbackLng="en">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{t('cardTitle')}</CardTitle>
          <CardDescription>{t('cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{t('regularText')}</p>
          <div>
            <Trans 
              i18nKey="LangCard.transText"
            >
              This is a <strong>Trans component</strong> example with a <a
                href="https://react.i18next.com/latest/trans-component"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center">
                link<ExternalLink className="ml-1 h-4 w-4" />
              </a>.
            </Trans>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={toggleLanguage} className="w-full">{t('switchLanguage')}</Button>
        </CardFooter>
      </Card>
    </I18nProvider>
  )
}
