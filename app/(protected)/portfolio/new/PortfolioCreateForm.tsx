"use client";

import { ArtworkCreditInfoData } from "@/app/form-schemas/artwork-credit-info";
import { ArtworkInfoData } from "@/app/form-schemas/artwork-info";
import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ArtworkProvider } from "@/contexts/ArtworkContext";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface PortfolioProjectCardProps {
  project: {
    portfolioArtworks: {
      id: string;
    };
  };
}

export function PortfolioProjectCard({ project }: PortfolioProjectCardProps) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const projectId = uuidv4();

  // Initialize artwork form
  const artworkForm = useForm<ArtworkInfoData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Initialize credits form
  const artworkCreditForm = useForm<ArtworkCreditInfoData>({
    defaultValues: {
      coartists: [],
    },
  });

  const handlePendingFilesUpdate = (files: File[]) => {
    setPendingFiles(files);
  };

  // Optional: Sync forms if needed
  const handleSubmit = async () => {
    const artworkData = artworkForm.getValues();
    const artworkCreditData = artworkCreditForm.getValues();

    // Combine data for submission
    const completeData = {
      artwork: artworkData,
      credits: artworkCreditData,
    };

    // Handle submission logic
    console.log("Complete data:", completeData);
  };

  return (
    <ArtworkProvider>
      <ThumbnailProvider>
        <div className="h-full w-full">
          <CardHeader>
            <h3 className="mb-4 text-lg font-medium">Project Info</h3>
            <FormProvider {...artworkForm}>
              <ArtworkInfoStep form={artworkForm} artworks={[]} />
            </FormProvider>
          </CardHeader>

          <CardContent className="space-y-6 p-6">

          </CardContent>
        </div>

        <CardFooter className="max-w-xl flex flex-col justify-between gap-4 p-6">
          <div className="container">
            <h3 className="mb-4 text-lg font-medium">Project Credits</h3>
            <FormProvider {...artworkCreditForm}>
              <ArtworkCreditInfoStep form={artworkCreditForm} />
            </FormProvider>
          </div>
          <div className="container">
            <h3 className="mb-4 text-lg font-medium">Project Media</h3>
            <MediaUpload
              isNewArtwork={true}
              emailLink="/contact"
              onPendingFilesUpdate={handlePendingFilesUpdate}
            />
          </div>

          <div className="container flex flex-col lg:gap-1">
            <Button className="rounded-full">Save</Button>
            <Button className="rounded-full">Save</Button>
            <Button className="rounded-full">Save</Button>
          </div>
        </CardFooter>
      </ThumbnailProvider>
    </ArtworkProvider>
  );
}
