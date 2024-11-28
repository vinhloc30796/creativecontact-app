"use client"
import { ArtworkCreditData, ArtworkCreditInfoData } from '@/app/form-schemas/artwork-credit-info'
import { ArtworkInfoData } from '@/app/form-schemas/artwork-info'
import { ArtworkInfoStep } from '@/components/artwork/ArtworkInfoStep'
import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { ArtworkProvider } from '@/contexts/ArtworkContext'
import { ThumbnailProvider } from '@/contexts/ThumbnailContext'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { v4 } from 'uuid'
import AddCoonwer from './add_coonwer.component'
import UploadInfo from './upload_info.component'
import { MediaUploadComponent } from './media_upload.component'
import { FileUploadProvider, useFileUpload } from './files_uplooad_provider.component'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'
import { handlerSubmit } from './action.client'
import { useToast } from '@/components/hooks/use-toast'
interface PortfolioCreateCardProps {
  project?: {
    portfolioArtworks: {
      id: string,
    }
  }
}
export default function PortfolioCreateCard(props: PortfolioCreateCardProps) {
  const { fileUploads, thumbnailFileName } = useFileUpload();
  const { t } = useTranslation(['ArtworkInfoStep'])
  const { toast } = useToast()
  const [submidLoading, setSubmidLoading] = useState(false);

  const projectId = v4();

  const artworkForm = useForm<ArtworkInfoData>({
    defaultValues: {
      id: projectId,
      title: "",
      description: "",
    },
  })

  const artworkCreditForm = useForm<ArtworkCreditInfoData>({
    defaultValues: {
      coartists: [],
    }
  })

  async function onSubmit() {
    setSubmidLoading(true);
    const rs = await handlerSubmit(artworkForm.getValues(), {}, fileUploads, thumbnailFileName);
    if (rs) {
      toast({
        title: t("submit.success.title"),
        description: t("submit.success.description"),
      })
    } else {
      toast({
        title: t("submit.error.title"),
        description: t("submit.error.description"),
      })
    }
    setSubmidLoading(false);
  }

  return (
    <Card className="container w-full max-h-full grow px-4 md:mx-auto mb-4 lg:flex justify-between flex-grow gap-4">
      <div className='grow position-absolute'>
        <CardHeader>
          <FormProvider {...artworkForm}>
            <FormField
              control={artworkForm.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t('title.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('title.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={artworkForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('description.label')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('description.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormProvider>
        </CardHeader>
        <div className="container px-6">
          <MediaUploadComponent />
        </div>
      </div>
      <CardFooter className="flex flex-col gap-2 p-4 md:min-w-[400px] items-start lg:gap-4">
        <AddCoonwer artworkCreditForm={artworkCreditForm} />
        <UploadInfo />
        <div className='w-full pt-10 flex flex-col gap-2'>
          <Button className='rounded-full w-full' onClick={onSubmit} disabled={submidLoading}>{
            submidLoading ? t('submitting') : t('submit')}</Button>
          <Button className='rounded-full w-full underline' variant={"secondary"} onClick={() => {
            artworkForm.reset();
            artworkCreditForm.reset();
          }}>Cancel</Button>
        </div>
      </CardFooter>
    </Card >
  )
}