// File: app/(public)/(event)/register/_sections/ContactInfoStep.tsx

import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { ContactInfoData } from "@/app/form-schemas/contact-info"
import { useTranslation } from 'react-i18next'

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
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('ContactInfoStep.phone.label')}</FormLabel>
            <FormControl>
              <Input placeholder={t('ContactInfoStep.phone.placeholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
