"use client";
import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import { ArtworkInfoData } from "@/app/form-schemas/artwork-info";
import { BorderlessCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import DataUsage from "@/components/uploads/DataUsage";
import { PortfolioEditorShell } from "../PortfolioEditorShell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProvider, useForm } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/init-client";
import { useUploadStore } from "@/stores/uploadStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { handleSubmit } from "./action.client";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ThumbnailProvider, useThumbnail } from "@/contexts/ThumbnailContext";
import EventMultiSelect, { EventOption } from "@/components/events/EventMultiSelect";

interface ThumbnailRefBridgeProps {
  onChange: (name: string | null) => void;
}

function ThumbnailRefBridge({ onChange }: ThumbnailRefBridgeProps) {
  const { thumbnailFileName } = useThumbnail();
  useEffect(() => {
    onChange(thumbnailFileName);
  }, [thumbnailFileName, onChange]);
  return null;
}

interface PortfolioCreateCardProps {
  project?: {
    portfolioArtworks: {
      id: string;
    };
  };
}
export default function PortfolioCreateCard(props: PortfolioCreateCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const thumbnailRef = useRef<string | null>(null);
  const { t } = useTranslation("en", ["Portfolio", "ArtworkInfoStep"]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<EventOption[]>([]);
  const [eventsLocked, setEventsLocked] = useState(false);

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

  // Prefill from ?eventSlug and lock if present
  useEffect(() => {
    const eventSlug = searchParams.get("eventSlug");
    let ignore = false;
    async function run() {
      if (eventSlug) {
        try {
          const rs = await fetch(`/api/events/${encodeURIComponent(eventSlug)}`);
          if (!rs.ok) return;
          const data = await rs.json();
          if (!ignore && data?.id) {
            setSelectedEvents([{ id: data.id, name: data.name, slug: data.slug }] as EventOption[]);
            setEventsLocked(true);
          }
        } catch {
          // ignore
        }
      }
    }
    run();
    return () => { ignore = true; };
  }, [searchParams]);

  async function onSubmit() {
    setSubmitLoading(true);
    resetUploadProgress();

    const rs = await handleSubmit(
      artworkForm.getValues(),
      { id: projectId },
      pendingFiles,
      thumbnailRef.current || "thumbnail.jpg",
      (progress, uploadedCount, totalCount) => {
        setUploadProgress(progress, uploadedCount, totalCount);
      },
    );

    setSubmitLoading(false);
    if (rs) {
      try {
        // After creation, set artwork events to selectedEvents
        const eventIds = selectedEvents.map((e) => e.id);
        if (eventIds.length > 0) {
          await fetch(`/api/artworks/${encodeURIComponent(artworkForm.getValues().id)}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventIds }),
          });
        }
      } catch {
        // non-blocking
      }
      toast.success(t("form.toast.success.title"), {
        duration: 5000,
      });
      const nextUrl = searchParams.get("next");
      if (nextUrl && nextUrl.startsWith("/")) {
        router.push(nextUrl);
      } else {
        router.push("/profile#portfolio?projectId=" + projectId);
      }
    } else {
      toast.error(t("form.toast.error.title"), {
        duration: 5000,
      });
    }
  }

  return (
    <PortfolioEditorShell
      title={t("newProject", { ns: "Portfolio" })}
      primaryLabel={submitLoading ? t("form.submit.submitting") : t("form.submit.create")}
      secondaryLabel={t("cancel")}
      onPrimary={onSubmit}
      onSecondary={() => { artworkForm.reset(); artworkCreditForm.reset(); setPendingFiles([]); }}
      rightRail={(
        <div className="flex flex-col gap-4">
          <BorderlessCard className="w-full">
            <CardHeader>
              <CardTitle>{t("creditInfo", { ns: "Portfolio" })}</CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...artworkCreditForm}>
                <ArtworkCreditInfoStep form={artworkCreditForm as any} />
              </FormProvider>
            </CardContent>
          </BorderlessCard>
          <BorderlessCard className="w-full">
            <CardHeader>
              <CardTitle>{t("dataUsage", { ns: "Portfolio" })}</CardTitle>
            </CardHeader>
            <CardContent>
              <DataUsage dataUsage={0} fileCount={pendingFiles.length} maxSizeMB={25} />
            </CardContent>
          </BorderlessCard>
        </div>
      )}
    >
      <div className="flex flex-col space-y-8">
        <FormProvider {...artworkForm}>
          <ArtworkInfoStep
            form={artworkForm as any}
            artworksCount={0}
            artworks={[]}
            showExistingArtworksHelper={false}
          />
        </FormProvider>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">{t("Related Events", { ns: "Portfolio" })}</label>
          <EventMultiSelect
            value={selectedEvents}
            onChange={setSelectedEvents}
            disabled={eventsLocked}
            prefilledNote={eventsLocked ? t("Prefilled from event context", { ns: "Portfolio" }) : null}
            lockReason={eventsLocked ? t("This association is locked by ?eventSlug", { ns: "Portfolio" }) : null}
          />
        </div>
        <ThumbnailProvider>
          <ThumbnailRefBridge onChange={(name) => { thumbnailRef.current = name; }} />
          <MediaUpload
            dataUsage={0}
            isNewArtwork={true}
            emailLink="/contact"
            onPendingFilesUpdate={(files) => {
              setPendingFiles(files);
            }}
          />
        </ThumbnailProvider>
      </div>

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
                {t("UploadProgress.fileCount", { current: uploadedFileCount, total: totalFileCount })}
              </p>
              <Progress value={uploadProgress} className="mt-2 w-full" />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </PortfolioEditorShell>
  );
}
