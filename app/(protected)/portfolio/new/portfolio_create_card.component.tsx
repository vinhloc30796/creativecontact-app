"use client";
import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import { ArtworkInfoData } from "@/app/form-schemas/artwork-info";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/init-client";
import { useUploadStore } from "@/stores/uploadStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 } from "uuid";
import { handleSubmit } from "./action.client";
import AddCoOwner from "./add_coowner.component";
import { useFileUpload } from "./files_uplooad_provider.component";
import { MediaUploadComponent } from "./media_upload.component";
import UploadInfo from "./upload_info.component";

interface PortfolioCreateCardProps {
  project?: {
    portfolioArtworks: {
      id: string;
    };
  };
}
export default function PortfolioCreateCard(props: PortfolioCreateCardProps) {
  const router = useRouter();
  const { fileUploads, thumbnailFileName } = useFileUpload();
  const { t } = useTranslation("en", ["Portfolio", "ArtworkInfoStep"]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    uploadProgress,
    uploadedFileCount,
    totalFileCount,
    setUploadProgress,
    resetUploadProgress,
  } = useUploadStore();

  const artworkUUID = v4();
  const projectId = v4();

  const artworkForm = useForm<ArtworkInfoData>({
    defaultValues: {
      id: artworkUUID,
      title: "",
      description: "",
    },
  });

  const artworkCreditForm = useForm<ArtworkCreditInfoData>({
    defaultValues: {
      coartists: [],
    },
  });

  async function onSubmit() {
    setSubmitLoading(true);
    resetUploadProgress();

    const rs = await handleSubmit(
      artworkForm.getValues(),
      { id: projectId },
      fileUploads,
      thumbnailFileName,
      (progress, uploadedCount, totalCount) => {
        setUploadProgress(progress, uploadedCount, totalCount);
      },
    );

    setSubmitLoading(false);
    if (rs) {
      toast.success(t("form.toast.success.title"), {
        duration: 5000,
      });
      router.push("/profile#portfolio?projectId=" + projectId);
    } else {
      toast.error(t("form.toast.error.title"), {
        duration: 5000,
      });
    }
  }

  return (
    <Card className="container mb-4 max-h-full w-full grow justify-between gap-4 px-4 md:mx-auto lg:flex rounded-none">
      <div className="position-absolute grow">
        <CardHeader>
          <FormProvider {...artworkForm}>
            <FormField
              control={artworkForm.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      {t("title.label", { ns: "ArtworkInfoStep" })}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("title.placeholder", {
                          ns: "ArtworkInfoStep",
                        })}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={artworkForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("description.label", { ns: "ArtworkInfoStep" })}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("description.placeholder", {
                        ns: "ArtworkInfoStep",
                      })}
                      {...field}
                    />
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
      <CardFooter className="flex flex-col items-start gap-2 p-4 md:min-w-[400px] lg:gap-4">
        <AddCoOwner artworkCreditForm={artworkCreditForm} />
        <UploadInfo />
        <div className="flex w-full flex-col gap-2 pt-10">
          <Button
            className="w-full rounded-none border"
            onClick={onSubmit}
            disabled={submitLoading}
          >
            {submitLoading
              ? t("form.submit.submitting")
              : t("form.submit.create")}
          </Button>
          <Button
            className="w-full rounded-none underline"
            variant={"secondary"}
            onClick={() => {
              artworkForm.reset();
              artworkCreditForm.reset();
            }}
          >
            {t("cancel")}
          </Button>
        </div>
      </CardFooter>

      {submitLoading && uploadProgress > 0 && (
        <Dialog open={true} onOpenChange={() => { }}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="mb-2 text-2xl font-bold">
                {t("UploadProgress.title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {t("UploadProgress.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <p className="text-sm text-gray-700">
                {t("UploadProgress.fileCount", {
                  current: uploadedFileCount,
                  total: totalFileCount,
                })}
              </p>
              <Progress value={uploadProgress} className="mt-2 w-full" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
