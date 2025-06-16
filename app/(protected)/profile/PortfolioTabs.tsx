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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
import { ArtworkWithAssets } from "@/app/api/artworks/[id]/assets/helper";
import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { ArtworkWithCredits } from "@/app/api/artworks/[id]/credits/helper";
import { deletePortfolio } from "@/app/actions/portfolio/server.action";
import { deletePortfolioClient } from "@/app/actions/portfolio/client.actions";

interface ProjectFormValues {
  title: string;
  description: string;
  uuid: string;
  coartists: any[];
}

interface ExistingPortfolioProjectCardProps {
  showButtons: boolean;
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  handlePendingFilesUpdate: (projectId: string, files: File[]) => void;
  project: PortfolioArtworkWithDetails;
  lang?: string;
}

function EmptyPortfolioProjectCard({
  showButtons,
  handleAddProject,
  lang = "en",
}: {
  showButtons: boolean;
  handleAddProject: () => void;
  lang?: string;
}) {
  const { t } = useTranslation(lang, "ProfilePage");

  return (
    <div className="py-12 text-center">
      <h3 className="mb-4 text-lg font-medium text-gray-600">
        {t("portfolio.noProjects")}
      </h3>
      <p className="mb-6 text-gray-500">{t("portfolio.getStarted")}</p>
      {showButtons && (
        <Button onClick={handleAddProject} variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t("portfolio.addProject")}
        </Button>
      )}
    </div>
  );
}

function ExistingPortfolioProjectCard({
  showButtons,
  form,
  project,
  lang = "en",
}: ExistingPortfolioProjectCardProps) {
  const router = useRouter();
  const { t } = useTranslation(lang, "ProfilePage");
  const { data: artworkWithAssets, isLoading: isLoadingAssets } = useQuery<
    ArtworkWithAssets[]
  >({
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

  const { data: artworkCredits, isLoading: isLoadingCredits } = useQuery<
    ArtworkWithCredits[]
  >({
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
  const [deleteLoading, setDeleteLoading] = useState(false);

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
  const handleDelete = async () => {
    setDeleteLoading(true);
    if (!project?.artworks?.id) {
      toast.error("Failed to delete the portfolio artwork", {
        description: "The artwork could not be found",
        duration: 5000,
      });
      return;
    }
    const rs = await deletePortfolioClient(project.portfolioArtworks.id);
    setDeleteLoading(false);
    if (rs.data?.success) {
      toast.success("Portfolio deleted successfully", {
        duration: 5000,
      });
    } else {
      toast.error("Failed to delete the portfolio artwork", {
        description: "The artwork could not be found",
        duration: 5000,
      });
    }
    window.location.reload();
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
      <div className="h-screen">
        <h4 className="mb-2 font-medium">{t("portfolio.media")}</h4>
        <div className="grid grid-cols-1 gap-4">
          {artworkWithAssets?.map(
            (item, index) =>
              item.assets && (
                <div
                  key={item.assets.id}
                  className="relative mb-4 w-full"
                  style={index < 2 ? { zIndex: 10 } : {}}
                >
                  {item.assets.assetType === "video" ? (
                    <video
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}#t=0.05`}
                      controls
                      className="w-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/artwork_assets/${item.assets.filePath}`}
                      alt={`${project.artworks?.title} - Asset ${index + 1}`}
                      layout="responsive"
                      width={100}
                      height={100}
                      className="object-contain"
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
    <Card className="w-full max-h-[calc(100vh-425px)] overflow-y-auto no-scrollbar border-0 rounded-none bg-transparent shadow-none">
      <FormProvider {...form}>
        <CardHeader className="items-left flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            {showButtons && (
              <Button variant="ghost" size="sm" asChild>
                {project.artworks?.id ? (
                  <Link href={`/portfolio/${project.artworks.id}`}>
                    {t("portfolio.edit")}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">
                    {t("portfolio.edit")}
                  </span>
                )}
              </Button>
            )}
            {showButtons && (
              <Button variant="ghost" size="sm" onClick={handleDelete}>
                {t("portfolio.delete")}
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-medium">
              {project.artworks?.title || t("portfolio.untitled")}
            </h3>
          </div>
          <div className="flex flex-col md:flex-row w-full">
            <div className="flex flex-col md:w-3/4">
              <h4 className="mb-2 font-medium">
                {t("portfolio.description")}
              </h4>
              <p className="text-gray-600">
                {project.artworks?.description || t("portfolio.noDescription")}
              </p>
            </div>
            <Separator orientation="vertical" className="mx-4 hidden md:block" />
            <div className="flex flex-col md:w-1/4 mt-4 md:mt-0">
              <h4 className="mb-2 font-medium">{t("portfolio.artists")}</h4>
              {isLoadingCredits ? (
                <Skeleton className="h-4" />
              ) : (
                <p className="text-gray-600">
                  {artworkCredits && artworkCredits.length > 0
                    ? artworkCredits
                      .map(
                        (credit: ArtworkWithCredits) =>
                          `${credit.displayName || "Anonymous"} (${credit.title})`,
                      )
                      .join(", ")
                    : t("portfolio.noArtists")}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <Separator className="my-2 border-b border-[#1A1A1A]" />
        <CardContent className="space-y-6 p-6">{renderContent()}</CardContent>
      </FormProvider>
    </Card>
  );
}

export function PortfolioTabs({
  showButtons,
  userData,
  existingPortfolioArtworks,
  lang = "en",
}: {
  showButtons: boolean;
  userData: UserData;
  existingPortfolioArtworks: PortfolioArtworkWithDetails[];
  lang?: string;
}) {
  console.log("[PortfolioTabs] Component mounting", {
    userId: userData?.id,
    existingArtworksCount: existingPortfolioArtworks?.length,
  });

  const router = useRouter();

  // Projects state
  const [projects, setProjects] = useState<PortfolioArtworkWithDetails[]>(
    () => {
      console.log("[PortfolioTabs] Initializing projects state", {
        count: existingPortfolioArtworks?.length,
      });
      return existingPortfolioArtworks || [];
    },
  );

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>(() => {
    const initialTab =
      projects.length > 0 ? projects[0].portfolioArtworks.id : "new";
    console.log("[PortfolioTabs] Setting initial active tab:", initialTab);
    return initialTab;
  });

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
    console.log("[PortfolioTabs] Adding new project");
    router.push("/portfolio/new");
  };

  // Handle pending files
  const handlePendingFilesUpdate = (projectId: string, files: File[]) => {
    console.log("[PortfolioTabs] Updating pending files", {
      projectId,
      filesCount: files.length,
    });
    setProjects(
      projects.map((p) =>
        p.portfolioArtworks.id === projectId ? { ...p, files } : p,
      ),
    );
  };

  console.log("[PortfolioTabs] Rendering with state:", {
    projectsCount: projects.length,
    activeTab,
    hasForm: !!form,
  });

  const { t } = useTranslation(lang, "ProfilePage");

  return (
    <>
      {projects.length === 0 ? (
        <EmptyPortfolioProjectCard
          showButtons={showButtons}
          handleAddProject={handleAddProject}
          lang={lang}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between rounded-none">
            <TabsList className="h-auto p-0 bg-[#FCFAF5] flex flex-row">
              {projects.map((project, index) => (
                <TabsTrigger
                  className="bg-[#FCFAF5] border-r border-[#1A1A1A] rounded-none px-5 py-4 text-[#1A1A1A] font-sans font-extrabold text-base leading-[1.26] tracking-[0.02em] uppercase transition-colors hover:bg-[#1A1A1A] hover:text-[#FCFAF5] data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FCFAF5] flex-shrink-0 relative"
                  style={{ marginLeft: index === 0 ? '0' : '-1px' }}
                  key={project.portfolioArtworks.id}
                  value={project.portfolioArtworks.id}
                >
                  {project.artworks?.title || t("portfolio.untitled")}
                </TabsTrigger>
              ))}
            </TabsList>

            {showButtons === true && (
              <Button onClick={handleAddProject} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("portfolio.addProject")}
              </Button>
            )}
          </div>
          {projects.map((project) => (
            <TabsContent
              className="mt-0 p-0 rounded-none border-t border-[#1A1A1A]"
              key={project.portfolioArtworks.id}
              value={project.portfolioArtworks.id}
            >
              <Suspense fallback={<div>{t("portfolio.loadingProject")}</div>}>
                <ExistingPortfolioProjectCard
                  showButtons={showButtons}
                  form={form}
                  handlePendingFilesUpdate={handlePendingFilesUpdate}
                  project={project}
                  lang={lang}
                />
              </Suspense>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </>
  );
}
