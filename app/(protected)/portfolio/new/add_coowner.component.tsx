import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Plus, TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
interface AddCoOwnerProps {
  artworkCreditForm: UseFormReturn<ArtworkCreditInfoData>;
}
export default function AddCoOwner({ artworkCreditForm }: AddCoOwnerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coartists, setCoartists] = useState(
    artworkCreditForm.getValues().coartists || [],
  );
  const addCoartist = (
    first_name: string,
    last_name: string,
    email: string,
    title: string,
    userId: string,
  ) => {
    const newArtist = { first_name, last_name, email, title, userId };
    setIsDialogOpen(false);
    const updatedCoartists = [...coartists, newArtist];
    setCoartists(updatedCoartists);
    artworkCreditForm.setValue("coartists", updatedCoartists);
  };

  const removeCoartist = (index: number) => {
    const updatedCoartists = coartists.filter((_, i) => i !== index);
    setCoartists(updatedCoartists);
    artworkCreditForm.setValue("coartists", updatedCoartists);
  };
  return (
    <div className="min-h-[200px] w-full">
      <h3 className="text-sm font-semibold uppercase">Add Co-onwer</h3>
      <div className="mb-4 flex w-full flex-col gap-2">
        {(artworkCreditForm.getValues().coartists || []).map(
          (coartist, index) => (
            <CoOwnerCard
              key={index}
              userId={coartist.userId}
              title={coartist.title}
              firstName={coartist.first_name}
              lastName={coartist.last_name}
              info={{ email: coartist.email }}
              delete={() => removeCoartist(index)}
            />
          ),
        )}
      </div>
      <FormProvider {...artworkCreditForm}>
        <AddCoOwnerDialog
          isOpen={isDialogOpen}
          setIsOpenDialog={() => setIsDialogOpen(!isDialogOpen)}
          addCoartist={addCoartist}
        />
      </FormProvider>
    </div>
  );
}

// Card for co-owner
interface CoOwnerCardProps {
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  info: {
    email: string;
  };
  delete: () => void;
}
export function CoOwnerCard(props: CoOwnerCardProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div>
        <p className="font-semibold">{`${props.title}: ${props.firstName} ${props.lastName}`}</p>
        <span className="text-sm text-muted-foreground">
          {props.info.email}
        </span>
      </div>
      <Button variant={"ghost"} onClick={props.delete}>
        x
      </Button>
    </div>
  );
}

// dialog add co-owner
interface AddCoOwnerDialogProps {
  isOpen: boolean;
  setIsOpenDialog: () => void;
  addCoartist: (
    firstName: string,
    lastName: string,
    email: string,
    title: string,
    userId: string,
  ) => void;
}
export function AddCoOwnerDialog(props: AddCoOwnerDialogProps) {
  const { t } = useTranslation("ArtworkCreditInfoStep");
  const [newCoartist, setNewCoartist] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    userId: "",
  });
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          {t("add")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.add.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <FormItem>
              <FormLabel>{t("dialog.fields.first_name.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("dialog.fields.first_name.placeholder")}
                  value={newCoartist.firstName}
                  onChange={(e) =>
                    setNewCoartist({
                      ...newCoartist,
                      firstName: e.target.value,
                    })
                  }
                />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>{t("dialog.fields.last_name.label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("dialog.fields.last_name.placeholder")}
                  value={newCoartist.lastName}
                  onChange={(e) =>
                    setNewCoartist({ ...newCoartist, lastName: e.target.value })
                  }
                />
              </FormControl>
            </FormItem>
          </div>

          <FormItem>
            <FormLabel>{t("dialog.fields.email.label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("dialog.fields.email.placeholder")}
                type="email"
                value={newCoartist.email}
                onChange={(e) =>
                  setNewCoartist({ ...newCoartist, email: e.target.value })
                }
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>{t("dialog.fields.title.label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("dialog.fields.title.placeholder")}
                value={newCoartist.title}
                onChange={(e) =>
                  setNewCoartist({ ...newCoartist, title: e.target.value })
                }
              />
            </FormControl>
          </FormItem>
          <div className="justify-space-between flex">
            <Button
              type="button"
              className="w-full rounded-full"
              onClick={() =>
                props.addCoartist(
                  newCoartist.userId,
                  newCoartist.firstName,
                  newCoartist.lastName,
                  newCoartist.email,
                  newCoartist.title,
                )
              }
            >
              {t("dialog.add.submit")}
            </Button>
            <Button
              variant={"outline"}
              className="w-full rounded-full"
              onClick={props.setIsOpenDialog}
            >
              {t("dialog.cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
