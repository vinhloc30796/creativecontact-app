"use client";

import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import {
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { FormProvider } from "react-hook-form";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { useForm } from "react-hook-form";

interface ProjectFormValues {
  title: string;
  description: string;
  uuid: string;
  coartists: any[];
}

interface PortfolioProjectCardProps {
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  handlePendingFilesUpdate: (projectId: string, files: File[]) => void;
  project: PortfolioArtworkWithDetails;
}

export function PortfolioProjectCard({
  form,
  handlePendingFilesUpdate,
  project,
}: PortfolioProjectCardProps) {
  return (
    <>
      <FormProvider {...form}>
        <CardHeader>
          <h3 className="mb-4 text-lg font-medium">Project Info</h3>
          <ArtworkInfoStep form={form} artworks={[]} />
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <h3 className="mb-4 text-lg font-medium">Project Media</h3>
          <ThumbnailProvider>
            <MediaUpload
              isNewArtwork={true}
              emailLink="/contact"
              onPendingFilesUpdate={(files) =>
                handlePendingFilesUpdate(project.portfolio_artworks.id, files)
              }
            />
          </ThumbnailProvider>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 p-6">
          <h3 className="mb-4 text-lg font-medium">Project Credits</h3>
          <ArtworkCreditInfoStep form={form} />
        </CardFooter>
      </FormProvider>
    </>
  );
}