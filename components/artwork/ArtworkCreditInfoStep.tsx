import { ArtworkWithCredits } from "@/app/api/artworks/[id]/credits/helper";
import {
  ArtworkCreditData,
  ArtworkCreditInfoData,
} from "@/app/form-schemas/artwork-credit-info";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ArtworkCreditInfoStepProps {
  form: UseFormReturn<ArtworkCreditInfoData>;
}

export function ArtworkCreditInfoStep({ form }: ArtworkCreditInfoStepProps) {
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCoartist, setNewCoartist] = useState({
    first_name: "",
    last_name: "",
    email: "",
    title: "",
    userId: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // I18n
  const { t } = useTranslation("ArtworkCreditInfoStep");

  const addCoartist = () => {
    const currentCoartists = form.getValues().coartists || [];
    if (editingIndex !== null) {
      const updatedCoartists = [...currentCoartists];
      updatedCoartists[editingIndex] = newCoartist;
      form.setValue("coartists", updatedCoartists);
    } else {
      form.setValue("coartists", [...currentCoartists, newCoartist]);
    }
    setNewCoartist({
      first_name: "",
      last_name: "",
      email: "",
      title: "",
      userId: "",
    });
    setIsDialogOpen(false);
    setEditingIndex(null);
  };

  const removeCoartist = (index: number) => {
    const currentCoartists = form.getValues().coartists || [];
    const updatedCoartists = currentCoartists.filter((_, i) => i !== index);
    form.setValue("coartists", updatedCoartists);
  };

  const editCoartist = (index: number) => {
    const currentCoartists = form.getValues().coartists || [];
    const coartistToEdit = currentCoartists[index];
    setNewCoartist({
      first_name: coartistToEdit.first_name,
      last_name: coartistToEdit.last_name,
      email: coartistToEdit.email,
      title: coartistToEdit.title,
      userId: coartistToEdit.userId,
    });
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>{t("label")}</FormLabel>
        <Badge variant="secondary">
          {form
            .watch("coartists")
            ?.filter(
              (coartist: ArtworkCreditData) =>
                coartist.first_name !== "" || coartist.last_name !== "",
            ).length || 0}
        </Badge>
      </div>
      <FormDescription>{t("description")}</FormDescription>
      {form
        .watch("coartists")
        ?.filter(
          (coartist: ArtworkCreditData) =>
            coartist.first_name !== "" || coartist.last_name !== "",
        )
        .map((coartist: ArtworkCreditData, index: number) => (
          <Card key={index} className="mb-4">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{`${coartist.first_name} ${coartist.last_name}`}</p>
                <p className="text-sm text-gray-500">{coartist.email}</p>
                <p className="text-sm">{coartist.title}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 p-4">
              <Button
                onClick={() => editCoartist(index)}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t("edit")}
              </Button>
              <Button
                onClick={() => removeCoartist(index)}
                variant="destructive"
                size="sm"
                className="mt-4"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("remove")}
              </Button>
            </CardFooter>
          </Card>
        ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            {t("add")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null
                ? t("dialog.edit.title")
                : t("dialog.add.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <FormItem className="flex-1">
                <FormLabel>{t("dialog.fields.first_name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("dialog.fields.first_name.placeholder")}
                    value={newCoartist.first_name}
                    onChange={(e) =>
                      setNewCoartist({
                        ...newCoartist,
                        first_name: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </FormItem>
              <FormItem className="flex-1">
                <FormLabel>{t("dialog.fields.last_name.label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("dialog.fields.last_name.placeholder")}
                    value={newCoartist.last_name}
                    onChange={(e) =>
                      setNewCoartist({
                        ...newCoartist,
                        last_name: e.target.value,
                      })
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
            <Button type="button" onClick={addCoartist}>
              {editingIndex !== null
                ? t("dialog.edit.submit")
                : t("dialog.add.submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
