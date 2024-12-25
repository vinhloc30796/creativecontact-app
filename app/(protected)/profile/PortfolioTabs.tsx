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
import { deletePortfolio } from "@/app/api/ portfolio/helper";
import { Dialog } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
        {t("portfolio.noProjects")}
      </h3>
      <p className="mb-6 text-gray-500">
        {t("portfolio.getStarted")}
      </p>
      <Button onClick={handleAddProject} variant="outline" size="sm">
        <Plus className="mr-2 h-4 w-4" />
        {t("portfolio.addProject")}
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
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    setDeleteLoading(true)
    if (!project?.artworks?.id) {
      toast.error(t("deletePortfolioResult.failure"), {
        description: "The artwork could not be found",
        duration: 5000,
      })
      return;
    }
    const rs = await deletePortfolio(project.portfolioArtworks.id);
    setDeleteLoading(false)
    if (rs.data?.success) {
      toast.success(t("deletePortfolioResult.success"), {
        duration: 5000,
      });
    } else {
      toast.error(t("deletePortfolioResult.failure"), {
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
      <div className="h-screen space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex flex-col md:col-span-3">
            <h4 className="mb-2 font-medium">{t("portfolio.description")}</h4>
            <p className="text-gray-600">
              {project.artworks?.description || t("portfolio.noDescription")}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="mb-2 font-medium">{t("portfolio.artists")}</h4>
            {isLoadingCredits ? (
              <Skeleton className="h-4" />
            ) : (
              <p className="text-gray-600">
                {artworkCredits && artworkCredits?.length > 0
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
    <>
      <Card className="h-[calc(100vh-425px)] w-full overflow-y-auto">
        <FormProvider {...form}>
          <CardHeader className="items-left flex flex-col">
            <div className="flex items-center gap-4">
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
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(true)}>
                {t("portfolio.delete")}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {project.artworks?.title || t("portfolio.untitled")}
              </h3>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">{renderContent()}</CardContent>
        </FormProvider>
      </Card>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent
          onCloseAutoFocus={() => setShowDeleteDialog(false)}
          onEscapeKeyDown={() => setShowDeleteDialog(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("dialogDeletePortfolio.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("dialogDeletePortfolio.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("dialogDeletePortfolio.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
            >{t("dialogDeletePortfolio.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
  console.log("[PortfolioTabs] Component mounting", {
    userId: userData?.id,
    existingArtworksCount: existingPortfolioArtworks?.length
  });

  const router = useRouter();

  // Projects state
  const [projects, setProjects] = useState<PortfolioArtworkWithDetails[]>(() => {
    console.log("[PortfolioTabs] Initializing projects state", {
      count: existingPortfolioArtworks?.length
    });
    return existingPortfolioArtworks || [];
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get("projectId");
    if (projectId && projects.find((p) => p.portfolioArtworks.id === projectId)) {
      return projectId;
    }
    const initialTab = projects.length > 0 ? projects[0].portfolioArtworks.id : "new";
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
      filesCount: files.length
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
    hasForm: !!form
  });

  const { t } = useTranslation(lang, "ProfilePage");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("portfolio.title")}</CardTitle>
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
                    {project.artworks?.title || t("portfolio.untitled")}
                  </TabsTrigger>
                ))}
              </TabsList>

              <Button onClick={handleAddProject} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t("portfolio.addProject")}
              </Button>
            </div>
            {projects.map((project) => (
              <TabsContent
                key={project.portfolioArtworks.id}
                value={project.portfolioArtworks.id}
              >
                <Suspense fallback={<div>{t("portfolio.loadingProject")}</div>}>
                  <ExistingPortfolioProjectCard
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
      </CardContent>
    </Card>
  );
}
