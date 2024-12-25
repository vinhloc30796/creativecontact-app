import { useTranslation } from '@/lib/i18n/init-client';
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { EditIcon, Plus, Trash2 } from 'lucide-react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const CoOwnerSchema = z.object({
  email: z.string().email(),
  title: z.string().min(1),
})
type CoOwerInfo = z.infer<typeof CoOwnerSchema>
interface AddCoOwnerProps {
  coownersForm: UseFormReturn<{
    coowners: CoOwerInfo[]
  }>
  lang: string
}
function AddCoOwner({ lang, coownersForm }: AddCoOwnerProps) {
  const { t } = useTranslation(lang, ["Portfolio", "ArtworkInfoStep"]);
  const [coowners] = coownersForm.watch(["coowners"])
  const [isOpen, setOpen] = React.useState(false)
  const coownerForm = useForm<CoOwerInfo>({
    defaultValues: {
      email: "",
      title: "",
    }
  })
  const deleteCowner = (email: string) => {
    coownersForm.setValue("coowners", coownersForm.getValues().coowners.filter((coowner) => coowner.email !== email))
  }
  return (
    <>
      <h2 className='font-semibold uppercase'>{t("projectCredits")}</h2>
      {coowners.map((coowner, index) => {
        return <CoOwnerRow key={index} data={coowner} delete={() => deleteCowner(coowner.email)} edit={() => {
          coownerForm.setValue("email", coowner.email)
          coownerForm.setValue("title", coowner.title)
          setOpen(true)
        }} />
      })}
      <Button className='w-full rounded-full' variant='secondary' onClick={() => setOpen(true)}> <Plus className='w-4 h-4 mr-2' /> {t("addCoOwner")}</Button>
      <CoOwnerDialog isOpen={isOpen} setOpen={setOpen} lang={lang} submit={(coowner) => {
        const updateData = coowner
        if (coownersForm.getValues().coowners.find((coowner) => coowner.email === updateData.email)) {
          coownersForm.setValue("coowners", coownersForm.getValues().coowners.map((coowner) => {
            if (coowner.email === updateData.email) {
              return updateData
            }
            return coowner
          }))
        } else {
          coownersForm.setValue("coowners", [...coownersForm.getValues().coowners, updateData])
        }

        coownerForm.reset({
          email: "",
          title: ""
        })
      }}
        data={coownerForm.getValues()}
      />
    </>
  )
}
interface CoOwnerRowProps {
  data: CoOwerInfo
  delete: () => void
  edit: () => void
}
function CoOwnerRow(props: CoOwnerRowProps) {
  return <div className='flex justify-between group gap-4 w-full borde-b border-gray-200 py-2 px-4'>
    <div className='flex flex-col justify-between w-full flex-wrap'>
      <p className=''>{props.data.email}</p>
      <Badge className='w-max lg:px-4'>
        {props.data.title}
      </Badge>
    </div>
    <div className='group-hover:flex gap-2 items-center flex'>
      <EditIcon className='h-4 w-4 hover:cursor-pointer' onClick={props.edit} />
      <Trash2 className='h-4 w-4 hover:cursor-pointer' onClick={props.delete} />
    </div>
  </div>
}

interface CoOwnerDialogProps {
  data?: {
    email: string,
    title: string,
  },
  isOpen: boolean,
  setOpen: (open: boolean) => void
  submit: (coowner: CoOwerInfo) => void
  lang: string
}
function CoOwnerDialog(props: CoOwnerDialogProps) {
  const lang = props.lang
  const { t } = useTranslation(lang, "ArtworkCreditInfoStep");
  const coownerForm = useForm<CoOwerInfo>({
    resolver: zodResolver(CoOwnerSchema),
    defaultValues: {
      email: props.data?.email || "",
      title: props.data?.title || "",
    }
  })
  useEffect(() => {
    coownerForm.reset({
      email: props.data?.email || "",
      title: props.data?.title || "",
    })
  }, [props.data])
  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("label")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormProvider {...coownerForm}>
          <div className="grid gap-4 py-4">
            <FormField
              control={coownerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input placeholder={t("dialog.fields.email.placeholder")}  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={coownerForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label>{t("dialog.fields.title.label")}</Label>
                  <FormControl>
                    <Input placeholder={t("dialog.fields.title.placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("dialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                coownerForm.handleSubmit((data) => {
                  props.submit(data)
                }, (err) => {
                  const errorMessages = Object.values(err)
                    .map(error => error?.message)
                    .filter(Boolean)
                    .join(', ');
                  toast.error(errorMessages || 'Validation failed');
                })()
              }}>
              {coownerForm.getValues().email ? t("edit") : t("add")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog >
  )
}

export {
  AddCoOwner,
  type CoOwerInfo
}