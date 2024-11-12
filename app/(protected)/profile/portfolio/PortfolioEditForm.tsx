// File: app/(protected)/profile/portfolio/PortfolioEditForm.tsx

"use client";

import { ArtworkWithAssets } from "@/app/api/artworks/[id]/assets/helper";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaUpload } from "@/components/uploads/media-upload";
import { ThumbnailProvider } from "@/contexts/ThumbnailContext";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { useTranslation } from "@/lib/i18n/init-client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Suspense, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormStateNav, Section } from "../edit/FormStateNav";

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

interface ExistingPortfolioProjectCardProps {
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  handlePendingFilesUpdate: (projectId: string, files: File[]) => void;
  project: PortfolioArtworkWithDetails;
}

function ExistingPortfolioProjectCard({
  form,
  handlePendingFilesUpdate,
  project,
}: ExistingPortfolioProjectCardProps) {
  // Error state
  if (!project.artworks) {
    return <div>Project not found</div>;
  }

  const [isEditing, setIsEditing] = useState(false);
  const { data: artworkWithAssets, isLoading } = useQuery<ArtworkWithAssets[]>({
    queryKey: ['artwork', project.artworks?.id],
    queryFn: async () => {
      const response = await fetch(`/api/artworks/${project.artworks?.id}/assets`);
      if (!response.ok) throw new Error('Failed to fetch artwork assets');
      return response.json();
    },
    enabled: !!project.artworks?.id
  });

  return (
    <Card className="w-full">
      <FormProvider {...form}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {isEditing ? "Edit Project" : project.artworks?.title || "Untitled"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Skeleton className="w-[200px] h-[200px] rounded-lg" />
            </div>
          ) : isEditing ? (
            <>
              <div className="space-y-4">
                <h4 className="font-medium">Project Info</h4>
                <ArtworkInfoStep form={form} artworks={[project.artworks]} />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Project Media</h4>
                <ThumbnailProvider>
                  <MediaUpload
                    isNewArtwork={false}
                    emailLink="/contact"
                    onPendingFilesUpdate={(files) =>
                      handlePendingFilesUpdate(project.portfolio_artworks.id, files)
                    }
                  />
                </ThumbnailProvider>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Project Credits</h4>
                <ArtworkCreditInfoStep form={form} />
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{project.artworks?.description || "No description provided"}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Media</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {artworkWithAssets?.map((item, index) =>
                    item.assets && (
                      <div
                        key={item.assets.id}
                        className="relative flex w-full items-center justify-center"
                      >
                        {item.assets.assetType === "video" ? (
                          <video
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}#t=0.05`}
                            controls
                            className="h-auto max-w-full"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}`}
                            alt={`${project.artworks?.title} - Asset ${index + 1}: link: ` + `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}`}
                            sizes="(min-width: 1024px) 66vw, 100vw"
                            width={1024}
                            height={1024}
                            style={{ objectFit: "contain" }}
                          />
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {isEditing && (
          <CardFooter className="flex justify-end gap-2 p-6">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        )}
      </FormProvider>
    </Card>
  );
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

function PortfolioSection({
  userData,
  existingPortfolioArtworks,
}: {
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
}) {
  // Track editing state per project
  const [editingStates, setEditingStates] = useState<Record<string, boolean>>({});
  
  // Projects state
  const [projects, setProjects] = useState<PortfolioArtworkWithDetails[]>(
    existingPortfolioArtworks || []
  );

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>(
    projects.length > 0 ? projects[0].portfolio_artworks.id : 'new'
  );

  // Form state
  const form = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "", 
      uuid: "",
      coartists: [],
    },
  });

  // Handle adding new project
  const handleAddProject = () => {
    const newProject: PortfolioArtworkWithDetails = {
      portfolio_artworks: {
        id: `new-${Date.now()}`, // Unique temp ID
        userId: userData.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        artworkId: "",
        displayOrder: projects.length,
        isHighlighted: false,
      },
      artworks: {
        id: "",
        title: "New Project",
        description: null,
        createdAt: new Date(),
      },
    };

    setProjects([...projects, newProject]);
    setActiveTab(newProject.portfolio_artworks.id);
    setEditingStates(prev => ({
      ...prev,
      [newProject.portfolio_artworks.id]: true
    }));
  };

  // Handle editing state changes
  const toggleEditing = (projectId: string) => {
    setEditingStates(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  // Handle pending files
  const handlePendingFilesUpdate = (projectId: string, files: File[]) => {
    setProjects(
      projects.map((p) =>
        p.portfolio_artworks.id === projectId
          ? { ...p, files }
          : p,
      ),
    );
  };

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

              <Button onClick={handleAddProject} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            </div>
            {projects.map((project) => (
              <TabsContent
                key={project.portfolio_artworks.id}
                value={project.portfolio_artworks.id}
              >
                <Suspense fallback={<div>Loading project...</div>}>
                  {activeTab === project.portfolio_artworks.id && (
                    project.portfolio_artworks.id.startsWith('new-') ? (
                      <PortfolioProjectCard
                        form={form}
                        handlePendingFilesUpdate={handlePendingFilesUpdate}
                        project={project}
                      />
                    ) : (
                      <ExistingPortfolioProjectCard
                        form={form}
                        handlePendingFilesUpdate={handlePendingFilesUpdate}
                        project={project}
                      />
                    )
                  )}
                </Suspense>
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
