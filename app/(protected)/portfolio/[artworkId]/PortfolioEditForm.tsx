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
  const [activeTab, setActiveTab] = useState<string>("info");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

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
    queryKey: ['artwork', artwork?.artworks?.id],
    queryFn: async () => {
      if (!artwork?.artworks?.id) {
        return [];
      }
      const response = await fetch(`/api/artworks/${artwork.artworks.id}/assets`);
      if (!response.ok) throw new Error('Failed to fetch artwork assets');
      return response.json();
    },
    enabled: !!artwork?.artworks?.id
  });

  const handleSubmit = async (formData: ArtworkFormValues) => {
    try {
      // Create or update artwork
      const artworkResponse = await fetch('/api/artworks', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: artwork?.artworks?.id,
        }),
      });

      if (!artworkResponse.ok) {
        throw new Error('Failed to save artwork');
      }

      const savedArtwork = await artworkResponse.json();

      // Handle file uploads if any
      if (pendingFiles.length > 0) {
        const formData = new FormData();
        pendingFiles.forEach(file => {
          formData.append('files', file);
        });
        formData.append('artworkId', savedArtwork.id);

        const uploadResponse = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload files');
        }
      }

      // Update portfolio artwork
      // TODO: This endpoint is not implemented yet
      const portfolioResponse = await fetch('/api/portfolio-artworks', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: artwork?.portfolioArtworks?.id,
          userId: userData.id,
          artworkId: savedArtwork.id,
        }),
      });

      if (!portfolioResponse.ok) {
        throw new Error('Failed to update portfolio');
      }

      // Redirect back to portfolio page
      router.push('/profile');
      router.refresh();
    } catch (error) {
      console.error('Error saving portfolio artwork:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isNew ? t("newProject") : t("editProject")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">{t("projectInfo")}</TabsTrigger>
                <TabsTrigger value="media">{t("projectMedia")}</TabsTrigger>
                <TabsTrigger value="credits">{t("projectCredits")}</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <ArtworkInfoStep 
                  form={form as any} 
                  artworks={artwork?.artworks ? [{
                    ...artwork.artworks,
                    description: artwork.artworks.description || "",
                  }] : []} 
                />
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <ThumbnailProvider>
                  <MediaUpload
                    isNewArtwork={isNew}
                    emailLink="/contact"
                    onPendingFilesUpdate={setPendingFiles}
                  />
                </ThumbnailProvider>

                {!isNew && !isLoading && artworkWithAssets && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {artworkWithAssets.map((item, index) => (
                      item.assets && (
                        <div
                          key={item.assets.id}
                          className="relative aspect-square"
                        >
                          {item.assets.assetType === "video" ? (
                            <video
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}#t=0.05`}
                              controls
                              className="h-full w-full object-cover"
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}`}
                              alt={`${artwork?.artworks?.title || 'Untitled'} - Asset ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="credits" className="space-y-4">
                <ArtworkCreditInfoStep form={form as any} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/portfolio')}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">
                {isNew ? t("create") : t("save")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}