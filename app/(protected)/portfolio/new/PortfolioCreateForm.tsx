"use client";

import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import {
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ArtworkProvider } from "@/contexts/ArtworkContext";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

interface ProjectFormValues {
  id: string;
  title: string;
  description: string;
  coartists?: Array<{
    first_name: string;
    last_name: string;
    email: string;
    title: string;
  }>;
}

interface PortfolioProjectCardProps {
  project: PortfolioArtworkWithDetails;
}

export function PortfolioProjectCard({
  project,
}: PortfolioProjectCardProps) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const handlePendingFilesUpdate = (
    portfolioArtworkId: string,
    files: File[]
  ) => {
    setPendingFiles(files);
  };

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      id: uuidv4(),
      title: "",
      description: "",
      coartists: [],
    },
  });

  return (
    <>
      <ArtworkProvider>
        <ThumbnailProvider>
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
                    handlePendingFilesUpdate(project.portfolioArtworks.id, files)
                  }
                />
              </ThumbnailProvider>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4 p-6">
              <h3 className="mb-4 text-lg font-medium">Project Credits</h3>
              <ArtworkCreditInfoStep form={form} />
            </CardFooter>
          </FormProvider>
        </ThumbnailProvider>
      </ArtworkProvider>
    </>
  );
}