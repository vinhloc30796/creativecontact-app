// File: app/(protected)/profile/portfolio/PortfolioEditForm.tsx

"use client";

import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "@/components/uploads/media-upload";
import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserData } from "@/app/types/UserInfo";

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  files: File[];
}

interface ProjectFormValues {
  title: string;
  description: string;
  uuid: string;
  coartists: any[];
}

interface PortfolioEditFormProps {
  userData: UserData;
  lang?: string;
}

interface PortfolioProjectCardProps {
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  handlePendingFilesUpdate: (projectId: string, files: File[]) => void;
  project: PortfolioProject;
}

function PortfolioProjectCard({ form, handlePendingFilesUpdate, project }: PortfolioProjectCardProps) {
  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <ArtworkInfoStep
          form={form}
          artworks={[]}
        />

        <ArtworkCreditInfoStep
          form={form}
        />

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Project Media</h3>
          <MediaUpload
            isNewArtwork={true}
            emailLink="/contact"
            onPendingFilesUpdate={(files) =>
              handlePendingFilesUpdate(project.id, files)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function PortfolioEditForm({
  userData,
  lang = "en",
}: PortfolioEditFormProps) {
  const { user, isLoggedIn } = useAuth();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeTab, setActiveTab] = useState<string>("new");

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
      uuid: "",
      coartists: [],
    },
  });

  const handleAddProject = () => {
    const newProject: PortfolioProject = {
      id: `project-${projects.length + 1}`,
      title: "New Project",
      description: "",
      files: [],
    };
    setProjects([...projects, newProject]);
    setActiveTab(newProject.id);
  };

  const handlePendingFilesUpdate = (projectId: string, files: File[]) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, files } : p
    ));
  };

  return (
    <BackgroundDiv>
      <div className="flex min-h-screen w-full flex-col">
        <main className="relative z-20 mt-10 w-full flex-grow justify-between lg:mt-20">
          <div className="w-full px-4 sm:px-8 md:px-16">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full overflow-y-auto pr-0 lg:w-2/3 lg:pr-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold">Portfolio</h1>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      {projects.map((project) => (
                        <TabsTrigger key={project.id} value={project.id}>
                          {project.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <Button onClick={handleAddProject} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>

                  {projects.map((project) => (
                    <TabsContent key={project.id} value={project.id}>
                      <PortfolioProjectCard
                        form={form}
                        handlePendingFilesUpdate={handlePendingFilesUpdate}
                        project={project}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BackgroundDiv>
  );
}