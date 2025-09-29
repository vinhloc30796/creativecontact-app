import { ArtworkInfoData } from "@/app/form-schemas/artwork-info";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface ArtworkInfoStepProps {
  artworksCount?: number;
  artworks: ArtworkInfoData[];
  form: UseFormReturn<{
    id: string;
    title: string;
    description: string;
  }>;
  showExistingArtworksHelper?: boolean;
}

function ExistingArtworkSidepane({
  artworks,
  isOpen,
  setIsOpen,
}: {
  artworks: ArtworkInfoData[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  // State
  const [selectedArtwork, setSelectedArtwork] = useState<string>("");
  // I18n
  const { t } = useTranslation(["ArtworkInfoStep"], {
    keyPrefix: "ExistingArtworkSelector",
  });

  useEffect(() => {
    if (selectedArtwork) {
      const artwork = artworks.find((a) => a.id === selectedArtwork);
      if (artwork) {
        setIsOpen(false);
      }
    }
  }, [selectedArtwork, artworks, setIsOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("selectArtworkTitle")}</SheetTitle>
          <SheetDescription>{t("selectArtworkDescription")}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="mt-6 h-[calc(100vh-200px)]">
          {artworks && artworks.length > 0 ? (
            <Table>
              <TableBody>
                {artworks.map((artwork) => (
                  <TableRow key={artwork.id}>
                    <TableCell className="font-medium">
                      <h2 className="font-semibold">{artwork.title}</h2>
                      <p className="text-xs text-muted-foreground">
                        {artwork.id}
                      </p>
                    </TableCell>
                    <TableCell>{artwork.description}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-4 text-center text-muted-foreground">
              {t("noArtworksFound")}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function ArtworkInfoStep({ form, artworksCount, showExistingArtworksHelper = true }: ArtworkInfoStepProps) {
  // State
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  // I18n
  const { t } = useTranslation(["ArtworkInfoStep"]);

  const {
    data: fetchedArtworks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["artworks", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.warn("No user id found to fetch artworks");
        return [];
      }
      const response = await fetch(
        `/api/artworks/by-uploader?uploaderId=${user.id}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch artworks");
      }
      const data = await response.json();
      if (data.artworks.length === 0) {
        console.log("No artworks found for user:", user.id);
      }
      return data.artworks;
    },
    enabled: !!user?.id,
  });

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("title.label")}</FormLabel>
            <FormControl>
              <Input placeholder={t("title.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("description.label")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("description.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {isLoading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-muted-foreground">
            {t("loadingExistingArtworks")}
          </span>
        </div>
      )}
      {error && <p>{t("ExistingArtworkSelector.error")}</p>}

      {showExistingArtworksHelper && fetchedArtworks && artworksCount === undefined && (
        <>
          <div className="mb-2 mt-4">
            {fetchedArtworks.length > 0 ? (
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  {t("ExistingArtworkSelector.existingArtworksCount", {
                    count: fetchedArtworks.length,
                  })}
                </p>
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setIsOpen(true)}
                >
                  &nbsp;{fetchedArtworks.length}&nbsp;
                </Badge>
              </div>
            ) : (
              <p className="text-sm">
                {t("ExistingArtworkSelector.noExistingArtworks")}
              </p>
            )}
          </div>
          <ExistingArtworkSidepane
            artworks={fetchedArtworks}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </>
      )}

      {showExistingArtworksHelper && artworksCount !== undefined && (
        artworksCount > 0 ? (
          <div className="mb-2 mt-4">
            <div className="flex items-center">
              <p className="text-sm">
                {t("ExistingArtworkSelector.existingArtworksCount")}
              </p>
              <Badge variant="secondary" className="mx-2">
                &nbsp;{artworksCount}&nbsp;
              </Badge>
            </div>
          </div>
        ) : (
          <p className="text-sm">
            {t("ExistingArtworkSelector.noExistingArtworks")}
          </p>
        )
      )}
    </>
  );
}
