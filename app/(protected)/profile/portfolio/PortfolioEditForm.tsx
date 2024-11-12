// File: app/(protected)/profile/portfolio/PortfolioEditForm.tsx

"use client";

import { UserData } from "@/app/types/UserInfo";
import { ArtworkCreditInfoStep } from "@/components/artwork/ArtworkCreditInfoStep";
import { ArtworkInfoStep } from "@/components/artwork/ArtworkInfoStep";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/lib/i18n/init-client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormStateNav, Section } from "../edit/FormStateNav";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";

interface ProjectFormValues {
  title: string;
  description: string;
  uuid: string;
  coartists: any[];
}

interface PortfolioEditFormProps {
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
  lang?: string;
}

interface PortfolioProjectCardProps {
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  handlePendingFilesUpdate: (projectId: string, files: File[]) => void;
  project: PortfolioArtworkWithDetails;
}

function PortfolioProjectCard({
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
                handlePendingFilesUpdate(project.id, files)
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

function PortfolioSection({
  userData,
  existingPortfolioArtworks,
}: {
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
}) {
  // Tabs
  const [activeTab, setActiveTab] = useState<string>("new");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Projects
  const [projects, setProjects] = useState<PortfolioArtworkWithDetails[]>(
    existingPortfolioArtworks || []
  );
  const [newProjectTitle, setNewProjectTitle] = useState<string>("");
  const handleAddProject = () => {
    const newProject: PortfolioArtworkWithDetails = {
      portfolio_artworks: {
        id: "",
        userId: userData.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        artworkId: "",
        displayOrder: projects.length,
        isHighlighted: false,
      },
      artworks: {
        id: "",
        title: newProjectTitle,
        description: null,
        createdAt: new Date(),
      },
    };
    setProjects([...projects, newProject]);
    setActiveTab(newProject.portfolio_artworks.id);
    setIsEditing(true);
  };
  // Files
  const handlePendingFilesUpdate = (projectId: string, files: File[]) => {
    setProjects(
      projects.map((p) =>
        p.portfolio_artworks.id === projectId
          ? { ...p, files }
          : p,
      ),
    );
  };
  // Form
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
      uuid: "",
      coartists: [],
    },
  });

  // Render
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="mb-4 text-lg font-medium text-gray-600">
              No projects yet
            </h3>
            <p className="mb-6 text-gray-500">
              Get started by adding your first project
            </p>
            <Button onClick={handleAddProject} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                {projects.map((project) => (
                  <TabsTrigger
                    key={project.portfolio_artworks.id}
                    value={project.portfolio_artworks.id}
                  >
                    {project.artworks?.title || "Untitled"}
                  </TabsTrigger>
                ))}
              </TabsList>

              {!isEditing && (
                <Button onClick={handleAddProject} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              )}
            </div>
            {projects.map((project) => (
              <TabsContent
                key={project.portfolio_artworks.id}
                value={project.portfolio_artworks.id}
              >
                <PortfolioProjectCard
                  form={form}
                  handlePendingFilesUpdate={handlePendingFilesUpdate}
                  project={project}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

export default function PortfolioEditForm({
  userData,
  existingPortfolioArtworks,
  lang = "en",
}: PortfolioEditFormProps) {
  const { t } = useTranslation(lang, "ProfilePage");

  const sections: Section[] = [
    {
      id: "portfolio",
      label: t("navigation.portfolio"),
      iconName: "briefcase",
    },
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    console.log(formData);
  };

  return (
    <div className="flex h-full flex-col gap-8 lg:flex-row">
      <div className="lg:w-1/3 lg:overflow-y-auto">
        <FormStateNav
          sections={sections}
          onSubmit={handleSubmit}
          title="navigation.editPortfolio"
        />
      </div>
      <div className="space-y-8 pb-8 lg:w-2/3 lg:overflow-y-auto">
        <PortfolioSection
          userData={userData}
          existingPortfolioArtworks={existingPortfolioArtworks}
        />
      </div>
    </div>
  );
}
