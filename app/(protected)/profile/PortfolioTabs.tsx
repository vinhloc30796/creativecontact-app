// File: app/(protected)/profile/portfolio/PortfolioEditForm.tsx

"use client";

import { ArtworkWithAssets } from "@/app/api/artworks/[id]/assets/helper";
import { UserData } from "@/app/types/UserInfo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { useTranslation } from "@/lib/i18n/init-client";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormStateNav, Section } from "../profile/edit/FormStateNav";

interface ProjectFormValues {
  title: string;
  description: string;
  uuid: string;
  coartists: any[];
}

interface PortfolioTabsProps {
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
  lang?: string;
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
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const { data: artworkWithAssets, isLoading } = useQuery<ArtworkWithAssets[]>({
    queryKey: ['artwork', project?.artworks?.id],
    queryFn: async () => {
      if (!project?.artworks?.id) {
        return [];
      }
      const response = await fetch(`/api/artworks/${project.artworks.id}/assets`);
      if (!response.ok) throw new Error('Failed to fetch artwork assets');
      return response.json();
    },
    enabled: !!project?.artworks?.id
  });

  if (!project?.artworks) {
    return <div>Project not found</div>;
  }

  const handleEdit = () => {
    if (project.artworks) {
      router.push(`/profile/portfolio/${project.artworks.id}`);
    }
    else {
      toast.error("Failed to edit the portfolio artwork", {
        description: "The artwork could not be found",
        duration: 5000
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <Skeleton className="w-[200px] h-[200px] rounded-lg" />
        </div>
      );
    }

    return (
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
                      alt={`${project.artworks?.title} - Asset ${index + 1}`}
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
    );
  };

  return (
    <Card className="w-full">
      <FormProvider {...form}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              {project.artworks?.title || "Untitled"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {renderContent()}
        </CardContent>
      </FormProvider>
    </Card>
  );
}

export function PortfolioTabs({
  userData,
  existingPortfolioArtworks,
}: {
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
}) {
  const router = useRouter();

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
    router.push('/profile/portfolio/new');
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