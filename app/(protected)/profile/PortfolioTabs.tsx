// File: app/(protected)/portfolio/PortfolioEditForm.tsx

"use client";

// External Libraries
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/lib/i18n/init-client";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// UI Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
import { ArtworkWithAssets } from "@/app/api/artworks/[id]/assets/helper";
import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { ArtworkWithCredits } from "@/app/api/artworks/[id]/credits/helper";

interface ProjectFormValues {
  title: string;
  description: string;
  uuid: string;
  coartists: any[];
}

interface ExistingPortfolioProjectCardProps {
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  handlePendingFilesUpdate: (projectId: string, files: File[]) => void;
  project: PortfolioArtworkWithDetails;
  lang?: string;
}

function EmptyPortfolioProjectCard({
  handleAddProject,
  lang = "en",
}: {
  handleAddProject: () => void;
  lang?: string;
}) {
  const { t } = useTranslation(lang, "ProfilePage");

  return (
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
  );
}

function ExistingPortfolioProjectCard({
  form,
  project,
  lang = "en",
}: ExistingPortfolioProjectCardProps) {
  const router = useRouter();
  const { t } = useTranslation(lang, "ProfilePage");
  const { data: artworkWithAssets, isLoading: isLoadingAssets } = useQuery<ArtworkWithAssets[]>({
    queryKey: ["artwork-assets", project?.artworks?.id],
    queryFn: async () => {
      if (!project?.artworks?.id) {
        return [];
      }
      const response = await fetch(
        `/api/artworks/${project.artworks.id}/assets`,
      );
      if (!response.ok) throw new Error("Failed to fetch artwork assets");
      return response.json();
    },
    enabled: !!project?.artworks?.id,
  });

  const { data: artworkCredits, isLoading: isLoadingCredits } = useQuery<ArtworkWithCredits[]>({
    queryKey: ["artwork-credits", project?.artworks?.id],
    queryFn: async () => {
      if (!project?.artworks?.id) {
        return [];
      }
      const response = await fetch(
        `/api/artworks/${project.artworks.id}/credits`,
      );
      if (!response.ok) throw new Error("Failed to fetch artwork credits");
      return response.json();
    },
    enabled: !!project?.artworks?.id,
  });


  if (!project?.artworks) {
    return <div>Project not found</div>;
  }

  const handleEdit = () => {
    if (project.artworks) {
      router.push(`/portfolio/${project.artworks.id}`);
    } else {
      toast.error("Failed to edit the portfolio artwork", {
        description: "The artwork could not be found",
        duration: 5000,
      });
    }
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete");
  };

  const renderContent = () => {
    if (isLoadingAssets) {
      return (
        <div className="flex min-h-[200px] items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-lg" />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 flex flex-col">
            <h4 className="mb-2 font-medium">Description</h4>
            <p className="text-gray-600">
              {project.artworks?.description || "No description provided"}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-2 font-medium">Artists</h4>
            {isLoadingCredits ? (
              <Skeleton className="h-4" />
            ) : (
              <p className="text-gray-600">
                {artworkCredits && artworkCredits?.length > 0 
                  ? artworkCredits.map((credit: ArtworkWithCredits) => (
                      `${credit.displayName || 'Anonymous'} (${credit.title})`
                    )).join(", ")
                  : "No artists provided"
                }
              </p>
            )}
          </div>
        </div>
        <h4 className="mb-2 font-medium">Media</h4>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {artworkWithAssets?.map(
            (item, index) =>
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
                      alt={`${project.artworks?.title} - Asset ${index + 1}`}
                      sizes="(min-width: 1024px) 66vw, 100vw"
                      width={1024}
                      height={1024}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </div>
              ),
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <FormProvider {...form}>
        <CardHeader className="flex flex-col items-left">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              {project.artworks?.id ? (
                <Link href={`/portfolio/${project.artworks.id}`}>
                  Edit
                </Link>
              ) : (
                <span className="text-muted-foreground">Edit</span>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {project.artworks?.title || "Untitled"}
            </h3>

          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">{renderContent()}</CardContent>
      </FormProvider>
    </Card>
  );
}

export function PortfolioTabs({
  userData,
  existingPortfolioArtworks,
  lang = "en",
}: {
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
  lang?: string;
}) {
  const router = useRouter();

  // Projects state
  const [projects, setProjects] = useState<PortfolioArtworkWithDetails[]>(
    existingPortfolioArtworks || [],
  );

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>(
    projects.length > 0 ? projects[0].portfolioArtworks.id : "new",
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
    router.push("/portfolio/new");
  };

  // Handle pending files
  const handlePendingFilesUpdate = (projectId: string, files: File[]) => {
    setProjects(
      projects.map((p) =>
        p.portfolioArtworks.id === projectId ? { ...p, files } : p,
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
          <EmptyPortfolioProjectCard
            handleAddProject={handleAddProject}
            lang={lang}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                {projects.map((project) => (
                  <TabsTrigger
                    key={project.portfolioArtworks.id}
                    value={project.portfolioArtworks.id}
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
                key={project.portfolioArtworks.id}
                value={project.portfolioArtworks.id}
              >
                <Suspense fallback={<div>Loading project...</div>}>
                  <ExistingPortfolioProjectCard
                    form={form}
                    handlePendingFilesUpdate={handlePendingFilesUpdate}
                    project={project}
                  />
                </Suspense>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
