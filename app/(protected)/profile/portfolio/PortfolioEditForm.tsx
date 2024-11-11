// File: app/(protected)/profile/portfolio/PortfolioEditForm.tsx

"use client";

import { UserData } from "@/app/types/UserInfo";
import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { useAuth } from "@/hooks/useAuth";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

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
      <FormProvider {...form}>
        <CardHeader>
          <h3 className="text-lg font-medium mb-4">Project Info</h3>
          <ArtworkInfoStep form={form} artworks={[]} />
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <h3 className="text-lg font-medium mb-4">Project Media</h3>
          <ThumbnailProvider>
            <MediaUpload
              isNewArtwork={true}
              emailLink="/contact"
              onPendingFilesUpdate={(files) =>
                handlePendingFilesUpdate(project.id, files)
              }
            />
          </ThumbnailProvider>
        </CardContent>
        <CardFooter className="p-6 flex flex-col gap-4 items-start">
          <h3 className="text-lg font-medium mb-4">Project Credits</h3>
          <ArtworkCreditInfoStep form={form} />
        </CardFooter>
      </FormProvider>
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
    setIsEditing(true);
  };

  const handlePendingFilesUpdate = (projectId: string, files: File[]) => {
    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, files } : p
    ));
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="relative z-20 mt-10 w-full flex-grow justify-between lg:mt-20">
        <div className="w-full px-4 sm:px-8 md:px-16">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full overflow-y-auto pr-0 lg:w-2/3 lg:pr-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold">Portfolio</h1>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-600 mb-4">No projects yet</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first project</p>
                  <Button onClick={handleAddProject} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="flex items-center justify-between mb-4">
                    <TabsList>
                      {projects.map((project) => (
                        <TabsTrigger key={project.id} value={project.id}>
                          {project.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {!isEditing && (
                      <Button onClick={handleAddProject} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    )}
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}