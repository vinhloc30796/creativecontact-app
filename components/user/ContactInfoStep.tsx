// File: app/(public)/(event)/register/_sections/ContactInfoStep.tsx

import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { ContactInfoData } from "@/app/form-schemas/contact-info"
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { CountryCodeSelector } from '@/components/profile/CountryCodeSelector'

interface ContactInfoStepProps {
  form: UseFormReturn<ContactInfoData>
}

export function ContactInfoStep({ form }: ContactInfoStepProps) {
  const { t } = useTranslation(['ContactInfoStep'])
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('ContactInfoStep.email.label')}</FormLabel>
            <FormControl>
              <Input placeholder={t('ContactInfoStep.email.placeholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex space-x-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ContactInfoStep.firstName.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('ContactInfoStep.firstName.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('ContactInfoStep.lastName.label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('ContactInfoStep.lastName.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        <FormLabel>{t('ContactInfoStep.phone.label')}</FormLabel>
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="phoneCountryCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CountryCodeSelector value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={t('ContactInfoStep.phone.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <Separator className="my-4" />
      <FormField
        control={form.control}
        name="instagramHandle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('ContactInfoStep.instagramHandle.label')}</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">https://instagram.com/</span>
                <Input placeholder={t('ContactInfoStep.instagramHandle.placeholder')} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="facebookHandle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('ContactInfoStep.facebookHandle.label')}</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500">https://facebook.com/</span>
                <Input placeholder={t('ContactInfoStep.facebookHandle.placeholder')} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
