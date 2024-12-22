import { useTranslation } from '@/lib/i18n/init-client';
import React from 'react'
import { Button } from '../ui/button';
import { EditIcon, Plus, Trash2 } from 'lucide-react';
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import { FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import { z } from 'zod';

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
  const coownerForm = useForm<CoOwerInfo>()
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
      <CoOwnerDialog isOpen={isOpen} setOpen={setOpen} coownerForm={coownerForm} lang={lang} submit={() => {
        const updateData = coownerForm.getValues()
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

        coownerForm.reset()
        console.info(coownersForm.getValues())
      }} />
    </>
  )
}
interface CoOwnerRowProps {
  data: CoOwerInfo
  delete: () => void
  edit: () => void
}
function CoOwnerRow(props: CoOwnerRowProps) {
  return <div className='flex justify-between group gap-4 w-full'>
    <div className='flex justify-between w-full flex-wrap'>
      <p className=''>{props.data.email}</p>
      <span className='text-xs text-white bg-red-500 px-2 py-1 rounded-full'>{props.data.title}</span>
    </div>
    <div className='group-hover:flex gap-2 items-center hidden w-max flex'>
      <EditIcon className='h-4 w-4 hover:cursor-pointer' onClick={props.edit} />
      <Trash2 className='h-4 w-4 hover:cursor-pointer' onClick={props.delete} />
    </div>
  </div>
}

interface CoOwnerDialogProps {
  isOpen: boolean,
  setOpen: (open: boolean) => void
  coownerForm: UseFormReturn<CoOwerInfo>,
  submit: () => void
  lang: string
}
function CoOwnerDialog(props: CoOwnerDialogProps) {
  const lang = props.lang
  const { t } = useTranslation(lang, "ArtworkCreditInfoStep");
  return (
    <AlertDialog open={props.isOpen} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("label")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormProvider {...props.coownerForm}>
          <form onSubmit={props.coownerForm.handleSubmit((data) => {
            console.log(data)
          })}>
            <div className="grid gap-4 py-4">
              <FormField
                control={props.coownerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <Input placeholder={t("dialog.fields.email.placeholder")} {...field} type='email' />
                  </FormItem>
                )}
              />
              <FormField
                control={props.coownerForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <Label>{t("dialog.fields.title.label")}</Label>
                    <Input placeholder={t("dialog.fields.title.placeholder")} {...field} />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <AlertDialogCancel>{t("dialog.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={props.submit}>
                {props.coownerForm.getValues().email ? t("edit") : t("add")}
              </AlertDialogAction>
            </DialogFooter>
          </form>
        </FormProvider>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export {
  AddCoOwner,
  type CoOwerInfo
}