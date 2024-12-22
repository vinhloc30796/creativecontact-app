"use client";
import { ArtworkInfoData } from '@/app/form-schemas/artwork-info'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from '@/lib/i18n/init-client'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DataUsageView, UploadFile, useUploadMedia } from './UploadFile'
import { v4 } from 'uuid';
import { MediasView } from './MediaView';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createPortfolio } from '@/app/api/ portfolio/helper';
import { AddCoOwner, CoOwerInfo } from './AddCoOwner';
interface PortfolioCreatePageProps {
  lang: string
}
export default function CreatePortfolioForm({ lang }: PortfolioCreatePageProps) {
  const { t } = useTranslation(lang, ["Portfolio", "ArtworkInfoStep"]);
  const router = useRouter();
  const { getfiles } = useUploadMedia();
  const coownersForm = useForm<{
    coowners: CoOwerInfo[]
  }>({
    defaultValues: {
      coowners: []
    }
  })
  const artworkForm = useForm<ArtworkInfoData>({
    defaultValues: {
      id: v4(),
      title: "",
      description: "",
    },
  })
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  const submit = async () => {
    const artworkAsset = getfiles();
    const rs = await createPortfolio(artworkForm.getValues(), artworkAsset, coownersForm.getValues().coowners);
    if (rs.error) {
      console.error(rs.error)
      toast.error(t("toast.error"), { duration: 5000 });
    }
    else {
      router.push("/profile#portfolio?projectId=" + artworkForm.getValues().id)
      toast.success(t("toast.success"), { duration: 5000 });
    }
  }
  const cancel = () => {
    router.push("/profile");
  }
  return (
    <div className='container bg-gray-200 bg-opacity-70 rounded-xl backdrop-blur-sm flex-grow lg:flex lg:justify-between p-2 lg:p-8 lg:gap-8'>
      <div className='w-full flex flex-col gap-2 lg:gap-4'>
        <FormProvider {...artworkForm}>
          <FormField
            control={artworkForm.control}
            name="title"
            render={({ field }) => (
              <FormItem >
                <FormControl>
                  <Input
                    className='rounded-xl'
                    placeholder={t("projectName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={artworkForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className='rounded-xl'
                    placeholder={t("projectDescription")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormProvider>
        <div className='w-full'>
          <MediasView lang={lang} />
          <UploadFile lang={lang} path={artworkForm.getValues().id} />
        </div>
      </div>
      <div className='relative min-w-72 flex flex-col justify-between max-h-[640px] lg:sticky lg:top-32'>
        <div className='flex flex-col gap-2'>
          <AddCoOwner lang={lang} coownersForm={coownersForm} />
        </div>
        <div className='flex flex-col gap-2 lg:gap-4'>
          <div>
            <h2 className='font-semibold uppercase'>{t("dataUsage")}</h2>
            <DataUsageView />
          </div>
          <div className='flex flex-col gap-2 pt-4'>
            <Button className='w-full rounded-full'
              onClick={submit}
            > {t("publish")}</Button>
            <Button
              onClick={cancel}
              variant='secondary'
              className='w-full rounded-full'
            > {t("cancel")}</Button>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        className='fixed bottom-4 right-4 z-50 flex gap-2 rounded-full items-center hidden lg:inline hover:underline'
        onClick={scrollToTop}>
        go to top
      </Button>
    </div >
  )
}
