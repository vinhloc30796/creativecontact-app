import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { getServerTranslation } from "@/lib/i18n/init-server";
import Link from 'next/link';

export default async function SignupSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang = "en" } = await searchParams;
  const { t } = await getServerTranslation(lang, ['signupSuccess'])

  return (
    <BackgroundDiv>
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
            <Link href="/">
              <Button>{t('backToHome')}</Button>
            </Link>
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
