'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv'
import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'

export default function SignupSuccessPage() {
  const { t } = useTranslation(['signupSuccess'])
  const router = useRouter()

  return (
    <BackgroundDiv eventSlug="early-access-2024">
      <Card className="w-[400px] mx-auto mt-10">
        <CardHeader
          className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: 'url(/signup-success-background.png), url(/banner.jpg)',
            backgroundSize: 'cover',
          }}
        />
        <CardContent className="p-6 flex flex-col gap-4">
          <div
            className="flex flex-col space-y-2 p-4 bg-primary bg-opacity-10 rounded-md"
          >
            <h2 className="text-2xl font-semibold text-primary">{t('title')}</h2>
            <p>{t('description')}</p>
          </div>
          <div className="space-y-4">
            <p>{t('nextSteps')}</p>
            <ul className="list-disc list-inside space-y-2">
              <li>{t('step1')}</li>
              <li>{t('step2')}</li>
              <li>{t('step3')}</li>
            </ul>
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={() => router.push('/')}>{t('backToHome')}</Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button disabled={true}>{t('goDashboard')}</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('comingSoon')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </BackgroundDiv>
  )
}
