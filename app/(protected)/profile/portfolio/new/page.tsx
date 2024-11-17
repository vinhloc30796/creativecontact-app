"use client";

import { ArtworkProvider } from "@/contexts/ArtworkContext";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { UserHeader } from "@/components/wrappers/UserHeader";
import { BackButton } from "../../BackButton";
import { PortfolioProjectCard } from "./PortfolioCreateForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ProjectFormValues {
  title: string;
  description: string;
  uuid: string;
  coartists: Array<{
    name: string;
    role: string;
  }>;
}

export default function PortfolioCreatePage() {
  const router = useRouter();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
      uuid: uuidv4(),
      coartists: [],
    },
  });

  const handlePendingFilesUpdate = (_: string, files: File[]) => {
    setPendingFiles(files);
  };

  const project = {
    portfolio_artworks: {
      id: "new",
    },
    artworks: null,
  };

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <UserHeader 
          lang="en"
          isLoggedIn={true}
          className="bg-background/80 backdrop-blur-sm"
        />

        <main className="relative z-20 mt-10 w-full flex-grow lg:mt-20">
          <div className="container mx-auto mb-4 px-4">
            <BackButton />
          </div>
          
          <div className="container mx-auto px-4">
            <Card className="w-full">
              <ArtworkProvider>
                <ThumbnailProvider>
                  <PortfolioProjectCard
                    form={form}
                    handlePendingFilesUpdate={handlePendingFilesUpdate}
                    project={project as any}
                  />
                </ThumbnailProvider>
              </ArtworkProvider>
            </Card>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}
