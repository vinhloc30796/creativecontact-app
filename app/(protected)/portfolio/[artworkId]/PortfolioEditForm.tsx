"use client";

import { ArtworkWithAssets } from "@/app/api/artworks/[id]/assets/helper";
import { UserData } from "@/app/types/UserInfo";
import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { useTranslation } from "@/lib/i18n/init-client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DataUsage from "@/components/uploads/DataUsage";
import { ArtworkService } from "@/services/artwork-service";
import { handleFileUpload } from "@/app/(public)/event/[eventSlug]/upload/client-helpers";
import { insertArtworkAssets } from "@/app/(public)/event/[eventSlug]/upload/actions";
import { useUploadStore } from "@/stores/uploadStore";

interface ArtworkFormValues {
  title: string;
  description: string;
  uuid: string;
  coartists: {
    email: string;
    first_name: string;
    last_name: string;
    title: string;
  }[];
}

interface PortfolioEditFormProps {
  userData: UserData;
  artwork?: PortfolioArtworkWithDetails;
  isNew: boolean;
  lang?: string;
}

export default function PortfolioEditForm({
  userData,
  artwork,
  isNew,
  lang = "en",
}: PortfolioEditFormProps) {
  const { t } = useTranslation(lang, "Portfolio");
  const router = useRouter();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const {
    uploadProgress,
    uploadedFileCount,
    totalFileCount,
    setUploadProgress,
    resetUploadProgress,
  } = useUploadStore();

  // Form setup with default values
  const form = useForm<ArtworkFormValues>({
    defaultValues: {
      title: artwork?.artworks?.title || "",
      description: artwork?.artworks?.description || "",
      uuid: artwork?.artworks?.id || "",
      coartists: [],
    },
  });

  // Fetch artwork assets if editing existing artwork
  const { data: artworkWithAssets, isLoading } = useQuery<ArtworkWithAssets[]>({
    queryKey: ["artwork", artwork?.artworks?.id],
    queryFn: async () => {
      if (!artwork?.artworks?.id) {
        return [];
      }
      const response = await fetch(
        `/api/artworks/${artwork.artworks.id}/assets`,
      );
      if (!response.ok) throw new Error("Failed to fetch artwork assets");
      return response.json();
    },
    enabled: !!artwork?.artworks?.id,
  });

  const handleSubmit = async (formData: ArtworkFormValues) => {
    console.log("Form data:", formData);

    try {
      // Update artwork
      await ArtworkService.updateArtworkInfo(formData.uuid, {
        title: formData.title,
        description: formData.description,
      });

      if (pendingFiles.length > 0) {
        const files = pendingFiles.map(
          (file) => new File([file], file.name, { type: file.type }),
        );

        const uploadedResults = await handleFileUpload(
          formData.uuid,
          files,
          "thumbnail.jpg", 
          setUploadProgress,
        );

        if (!uploadedResults) {
          console.error("File upload failed");
          throw new Error("File upload failed");
        }

        // Insert assets
        const insertAssetsResult = await insertArtworkAssets(
          formData.uuid,
          uploadedResults
        );
        console.log("Insert assets successful:", insertAssetsResult);
      }

      router.push("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="flex flex-row space-x-8">
        <Card className="w-full" style={{ flex: 7 }}>
          <CardHeader>
            <CardTitle>{isNew ? t("newProject") : t("editProject")}</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col space-y-8"
            >
              <div className="flex flex-col space-y-4">
                <ArtworkInfoStep
                  form={form as any}
                  artworks={
                    artwork?.artworks
                      ? [
                          {
                            ...artwork.artworks,
                            description: artwork.artworks.description || "",
                          },
                        ]
                      : []
                  }
                />

                {pendingFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {pendingFiles.reduce((acc, file) => acc + file.size, 0) /
                      1024 /
                      1024}{" "}
                    MB
                  </p>
                )}
                {!isNew && !isLoading && artworkWithAssets && (
                  <div className="h-full">
                    {artworkWithAssets.map(
                      (item, index) =>
                        item.assets && (
                          <div
                            key={item.assets.id}
                            className="relative mb-4 w-full"
                            style={index < 2 ? { zIndex: 10 } : {}}
                          >
                            {item.assets.assetType === "video" ? (
                              <video
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}#t=0.05`}
                                controls
                                className="w-full"
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <div className="relative h-auto w-full">
                                <Image
                                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}`}
                                  alt={`${artwork?.artworks?.title || "Untitled"} - Asset ${index + 1}`}
                                  layout="responsive"
                                  width={100}
                                  height={100}
                                  className="object-contain"
                                />
                              </div>
                            )}
                          </div>
                        ),
                    )}
                  </div>
                )}

                <ThumbnailProvider>
                  <MediaUpload
                    isNewArtwork={isNew}
                    emailLink="/contact"
                    onPendingFilesUpdate={setPendingFiles}
                  />
                </ThumbnailProvider>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex w-full flex-col" style={{ flex: 3 }}>
          <div className="sticky top-[100px]">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{t("creditInfo")}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col space-y-4">
                  <ArtworkCreditInfoStep form={form as any} />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex-grow"></div>{" "}
          {/* This div will take up the remaining space */}
          <div className="sticky bottom-0">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{t("dataUsage")}</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="mt-1">
                  <DataUsage />
                </div>
              </CardContent>
            </Card>
            <div className="mt-4 flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                onClick={form.handleSubmit(handleSubmit)}
              >
                {isNew ? t("create") : t("save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/profile")}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4"></div>
    </FormProvider>
  );
}
