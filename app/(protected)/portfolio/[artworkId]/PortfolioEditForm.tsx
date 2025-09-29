"use client";

import { ArtworkWithAssets } from "@/app/api/artworks/[id]/assets/helper";
import { UserData } from "@/app/types/UserInfo";
import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { Button } from "@/components/ui/button";
import { BorderlessCard, CardContent, CardHeader, CardHeaderSticky, CardTitle } from "@/components/ui/card";
import { PortfolioEditorShell } from "../PortfolioEditorShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { useTranslation } from "@/lib/i18n/init-client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DataUsage from "@/components/uploads/DataUsage";
import { ArtworkService } from "@/services/artwork-service";
import {
  handleCoArtists,
  handleFileUpload,
} from "@/app/(public)/event/[eventSlug]/upload/client-helpers";
import { insertArtworkAssets } from "@/app/(public)/event/[eventSlug]/upload/actions";
import { useUploadStore } from "@/stores/uploadStore";
import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import EventMultiSelect, { EventOption } from "@/components/events/EventMultiSelect";
import { useSearchParams } from "next/navigation";

interface ArtworkFormValues {
  title: string;
  description: string;
  id: string;
  uuid: string;
  coartists: {
    userId: string;
    email: string;
    first_name: string;
    last_name: string;
    title: string;
  }[];
}

interface PortfolioEditFormProps {
  dataUsage: number;
  userData: UserData;
  artwork?: PortfolioArtworkWithDetails;
  isNew: boolean;
  lang?: string;
}

interface ArtworkCredit {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  title: string;
}

export default function PortfolioEditForm({
  dataUsage,
  userData,
  artwork,
  isNew,
  lang = "en",
}: PortfolioEditFormProps) {
  const { t } = useTranslation(lang, "Portfolio");
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get("eventSlug");
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
      id: artwork?.artworks?.id || "",
      description: artwork?.artworks?.description || "",
      uuid: artwork?.artworks?.id || "",
      coartists: [],
    },
  });

  // Events state
  const [selectedEvents, setSelectedEvents] = useState<EventOption[]>([]);
  const [eventsLocked, setEventsLocked] = useState(false);

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
  // Load existing events for artwork and handle ?eventSlug lock/prefill
  useEffect(() => {
    let ignore = false;
    async function loadExisting() {
      const id = artwork?.artworks?.id;
      if (!id) return;
      try {
        const rs = await fetch(`/api/artworks/${encodeURIComponent(id)}/events`);
        if (!rs.ok) return;
        const data: { id: string; name: string; slug: string }[] = await rs.json();
        if (!ignore) setSelectedEvents(data);
      } catch { }
    }
    loadExisting();
    return () => { ignore = true; };
  }, [artwork?.artworks?.id]);

  useEffect(() => {
    if (!eventSlug) return;
    let ignore = false;
    async function prefillFromSlug(slugParam: string) {
      try {
        const rs = await fetch(`/api/events/${encodeURIComponent(slugParam)}`);
        if (!rs.ok || ignore) return;
        const data = await rs.json();
        if (data?.id) {
          // ensure included in selection and lock
          setSelectedEvents((prev) => {
            const exists = prev.some((e) => e.id === data.id);
            return exists ? prev : [...prev, { id: data.id, name: data.name, slug: data.slug }];
          });
          setEventsLocked(true);
        }
      } catch { }
    }
    prefillFromSlug(eventSlug);
    return () => { ignore = true; };
  }, [eventSlug]);

  const { data: artworkCredits, isLoading: isLoadingCredits } = useQuery<
    ArtworkCredit[]
  >({
    queryKey: ["artwork-credits", artwork?.artworks?.id],
    queryFn: async () => {
      if (!artwork?.artworks?.id) {
        return [];
      }
      const response = await fetch(
        `/api/artworks/${artwork.artworks.id}/credits`,
      );
      if (!response.ok) throw new Error("Failed to fetch artwork credits");
      const data: ArtworkCredit[] = await response.json();
      return data;
    },
    enabled: !!artwork?.artworks?.id,
  });

  useEffect(() => {
    if (artworkCredits) {
      const coartists = (artworkCredits || []).map((credit: ArtworkCredit) => ({
        userId: credit.userId,
        email: "", // Email is not stored in the credits table
        first_name: credit.firstName,
        last_name: credit.lastName,
        title: credit.title,
      }));
      form.setValue("coartists", coartists);
    }
  }, [artworkCredits, form]);

  console.log("Artwork credits:", artworkCredits);

  console.log("Form data", form.getValues());

  const handleSubmit = async (formData: ArtworkFormValues) => {
    try {
      // Update artwork
      await ArtworkService.updateArtworkInfo(formData.uuid, {
        title: formData.title,
        description: formData.description,
      });

      await handleCoArtists(
        formData,
        form.getValues() as ArtworkCreditInfoData,
        "eventSlug",
      );

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
          uploadedResults,
        );
        console.log("Insert assets successful:", insertAssetsResult);
      }

      // Update artwork events to match selection (respect lock by including slug ensured above)
      try {
        const eventIds = selectedEvents.map((e) => e.id);
        await fetch(`/api/artworks/${encodeURIComponent(formData.uuid)}/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventIds }),
        });
      } catch { }

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...form}>
      <PortfolioEditorShell
        title={isNew ? t("newProject") : t("editProject")}
        primaryLabel={isNew ? t("create") : t("save")}
        secondaryLabel={t("cancel")}
        onPrimary={form.handleSubmit(handleSubmit)}
        onSecondary={() => router.push("/profile")}
        rightRail={(
          <div className="flex flex-col gap-4">
            <BorderlessCard className="w-full">
              <CardHeader>
                <CardTitle>{t("creditInfo")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <ArtworkCreditInfoStep form={form as any} />
                </div>
              </CardContent>
            </BorderlessCard>
            <BorderlessCard className="w-full">
              <CardHeader>
                <CardTitle>{t("dataUsage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-1">
                  <DataUsage dataUsage={dataUsage} fileCount={pendingFiles.length} maxSizeMB={25} />
                </div>
              </CardContent>
            </BorderlessCard>
          </div>
        )}
      >
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-4">
            <ArtworkInfoStep
              form={form as any}
              artworksCount={artworkWithAssets?.length || 0}
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
            <ThumbnailProvider>
              <MediaUpload
                dataUsage={dataUsage}
                isNewArtwork={isNew}
                emailLink="/contact"
                onPendingFilesUpdate={setPendingFiles}
              />
            </ThumbnailProvider>
            {pendingFiles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {pendingFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024} MB
              </p>
            )}

            {!isNew && !isLoading && artworkWithAssets && (
              <div className="grid grid-cols-1 gap-4">
                {artworkWithAssets.map(
                  (item, index) =>
                    item.assets && (
                      <div key={item.assets.id} className="relative w-full" style={index < 2 ? { zIndex: 10 } : {}}>
                        {item.assets.assetType === "video" ? (
                          <video
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}#t=0.05`}
                            controls
                            className="w-full h-auto"
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

          </div>
        </div>
      </PortfolioEditorShell>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Related Events</label>
        <EventMultiSelect
          value={selectedEvents}
          onChange={setSelectedEvents}
          disabled={eventsLocked}
          prefilledNote={eventsLocked ? "Prefilled from event context" : null}
          lockReason={eventsLocked ? "This association is locked by ?eventSlug" : null}
        />
      </div>
    </FormProvider>
  );
}
