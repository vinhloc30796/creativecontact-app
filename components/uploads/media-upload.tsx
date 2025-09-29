"use client";

// NextJS
import Link from "next/link";
// ShadCN
import { AlertCircle, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Trans, useTranslation } from "react-i18next";
// Custom
import { FileTable } from "./FileTable";
// Types
import { SupabaseFile } from "@/app/types/SupabaseFile";
import { useThumbnail } from "@/contexts/ThumbnailContext";
import usePendingSizeStore from "@/stores/usePendingSizeStore";

interface MediaUploadProps {
  dataUsage: number;
  artworkUUID?: string;
  emailLink: string;
  isNewArtwork: boolean;
  onPendingFilesUpdate: (files: File[]) => void;
}

export function MediaUpload({
  dataUsage,
  artworkUUID,
  isNewArtwork,
  emailLink,
  onPendingFilesUpdate,
}: MediaUploadProps) {
  console.log("MediaUpload component rendering", {
    artworkUUID,
    isNewArtwork,
    emailLink,
  });
  // Constants
  const maxSize = 25 * 1024 * 1024; // 25MB in bytes

  // States
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const { thumbnailFileName, setThumbnailFileName } = useThumbnail();
  const { pendingSize, setPendingSize } = usePendingSizeStore();

  // I18n
  const { t } = useTranslation(["media-upload"]);
  // Callbacks
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setPendingFiles((prevFiles) => {
        const newFiles = [...prevFiles, ...acceptedFiles];
        onPendingFilesUpdate(newFiles);
        return newFiles;
      });
    },
    [onPendingFilesUpdate],
  );
  // Remove a file from the pending files list
  const removeFile = (fileToRemove: File | SupabaseFile) => {
    setPendingFiles((prevFiles) => {
      const newFiles = prevFiles.filter(
        (file) => file.name !== fileToRemove.name,
      );
      if (thumbnailFileName === fileToRemove.name) {
        const newThumbnailFile = newFiles.length > 0 ? newFiles[0].name : null;
        setThumbnailFileName(newThumbnailFile);
      }
      // Pass the updated file list to the parent component
      onPendingFilesUpdate(newFiles);
      return newFiles;
    });
  };
  // Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    const size = pendingFiles.reduce((acc, file) => acc + file.size, dataUsage);
    setPendingSize(size);
  }, [dataUsage, pendingFiles, setPendingSize]);

  useEffect(() => {
    if (pendingFiles.length > 0 && !thumbnailFileName) {
      setThumbnailFileName(pendingFiles[0].name);
    }
  }, [pendingFiles, thumbnailFileName, setThumbnailFileName]);

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-md border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border"
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("form.dropzone")}
          </p>
        </div>
        {pendingFiles.length > 0 && (
          <FileTable
            files={pendingFiles.map((file) => ({
              id: file.name,
              path: file.name,
              fullPath: file.name,
              name: file.name,
              size: file.size,
              isThumbnail: file.name === thumbnailFileName,
            }))}
            isReadonly={false}
            removeFile={removeFile}
          />
        )}
        <div className="flex items-center space-x-2">
          <p className="my-4 text-sm text-muted-foreground">
            {t("button.email_description")}{" "}
            <Link href={emailLink} className="text-primary hover:underline">
              {t("button.email")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
