"use client"

// NextJS
import Link from 'next/link'
// ShadCN
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertCircle, RefreshCw, Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { toast } from "sonner"
// Database, query, states, i18n
import { createClient } from "@/utils/supabase/client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
// Custom
import { FileTable } from './FileTable'
// Types
import { SupabaseFile, ThumbnailSupabaseFile } from '@/app/types/SupabaseFile'
import { toNonAccentVietnamese } from '@/lib/vietnamese'

interface MediaUploadProps {
  artworkUUID?: string;
  emailLink: string;
  isNewArtwork: boolean;
  onUpload: (
    results: ThumbnailSupabaseFile[],
    errors: { message: string }[]
  ) => void;
}

export function MediaUpload({ artworkUUID, isNewArtwork, emailLink, onUpload }: MediaUploadProps) {
  // Constants
  const maxSize = 25 * 1024 * 1024 // 25MB in bytes
  const bucketName = 'artwork_assets'
  // Use Query
  const queryClient = useQueryClient()
  // States
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  // I18n
  const { t } = useTranslation(['media-upload'])

  const { data: uploadedFiles = [], isLoading: isUploadedFilesLoading, error: uploadedFilesError } = useQuery({
    queryKey: ['uploadedFiles', artworkUUID],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .storage
        .from(bucketName)
        .list(artworkUUID);

      if (error) {
        console.error('Error fetching uploaded files:', error);
        return [];
      }

      return data.map(file => ({
        id: file.id,
        path: file.name,
        fullPath: `${artworkUUID}/${file.name}`,
        name: file.name,
        size: file.metadata?.size || 0,
        isThumbnail: toNonAccentVietnamese(file.name) === toNonAccentVietnamese(thumbnailFile || '')
      }));
    },
    enabled: !!artworkUUID
  });

  useEffect(() => {
    if (uploadedFiles.length > 0 && !thumbnailFile) {
      setThumbnailFile(uploadedFiles[0].name);
    }
  }, [uploadedFiles, thumbnailFile]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPendingFiles(prevFiles => {
      const newFiles = [...prevFiles, ...acceptedFiles];
      if (newFiles.length > 0 && !thumbnailFile) {
        setThumbnailFile(newFiles[0].name);
      }
      return newFiles;
    })
  }, [thumbnailFile])

  const removeFile = (fileToRemove: File | SupabaseFile) => {
    setPendingFiles(prevFiles => {
      const newFiles = prevFiles.filter(file => file.name !== fileToRemove.name);
      if (thumbnailFile === fileToRemove.name) {
        setThumbnailFile(newFiles.length > 0 ? newFiles[0].name : null);
      }
      return newFiles;
    })
  }

  const resetFiles = () => {
    setPendingFiles([])
    if (isNewArtwork) {
      queryClient.setQueryData(['uploadedFiles', artworkUUID], [])
    }
    setThumbnailFile(null)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const pendingSize = useMemo(() => pendingFiles.reduce((acc, file) => acc + file.size, 0), [pendingFiles]);
  const uploadedSize = useMemo(() => {
    if (isUploadedFilesLoading) return 0;
    return uploadedFiles.reduce((acc, file) => acc + file.size, 0);
  }, [uploadedFiles, isUploadedFilesLoading]);
  const totalSize = pendingSize + uploadedSize;

  const isOverLimit = totalSize > maxSize

  const handleUpload = async (): Promise<string | null> => {
    setUploading(true)
    try {
      const supabase = createClient()
      let results: { id: string; path: string; fullPath: string; }[] = [];
      let errors: { message: string }[] = [];
      let successCount = 0;
      let uploadedFilesList: ThumbnailSupabaseFile[] = [];
      let remainingFiles: File[] = [];

      // Remove all files in the existing storage folder before uploading new files
      if (artworkUUID) {
        const { data: fileList, error } = await supabase
          .storage
          .from(bucketName)
          .list(artworkUUID);
        if (error) {
          console.error('Error listing files:', error.message);
        } else {
          for (const file of fileList) {
            const { error: deleteError } = await supabase
              .storage
              .from(bucketName)
              .remove([`${artworkUUID}/${file.name}`]);
            if (deleteError) {
              console.error('Error deleting file:', deleteError.message);
              toast.error(t("delete-toast.error.title"), {
                description: `${file.name}: ${deleteError.message}`,
                duration: 3000,
              })
            } else {
              console.log('File deleted successfully:', file.name)
              toast.success(t("delete-toast.success.title"), {
                description: t("delete-toast.success.description", { file: file.name }),
                duration: 3000,
              })
            }
          }
        }
      }

      // Upload files
      for (const file of pendingFiles) {
        const normalizedFileName = toNonAccentVietnamese(file.name)
        const { data, error } = await supabase.storage.from(bucketName).upload(`${artworkUUID}/${normalizedFileName}`, file, { upsert: false })
        if (error) {
          console.error('Error uploading file:', error.message)
          toast.error(t("toast.error.title"), {
            description: `${file.name}: ${error.message}`,
            duration: 3000,
          })
          errors.push({ message: error.message })
          remainingFiles.push(file)
        } else {
          console.log('Files uploaded successfully:', data)
          toast.success(t("toast.success.title"), {
            description: t("toast.success.description", { file: file.name }),
            duration: 3000,
          })
          results.push({ id: data.path, path: data.path, fullPath: data.fullPath })
          uploadedFilesList.push({
            id: data.path,
            path: data.path,
            fullPath: data.fullPath,
            name: file.name,
            size: file.size,
            isThumbnail: file.name === thumbnailFile
          })
          successCount++;
        }
      }
      // Update the uploaded files list in the query cache
      queryClient.setQueryData(['uploadedFiles', artworkUUID], (oldData: any) => [...(oldData || []), ...uploadedFilesList]);
      setPendingFiles(remainingFiles);
      onUpload(uploadedFilesList, errors)

      // Recalculate uploadedSize after upload
      queryClient.invalidateQueries({ queryKey: ['uploadedFiles', artworkUUID] });

      return artworkUUID || null
    } catch (error) {
      console.error('Error uploading files:', error)
      return null;
    } finally {
      setUploading(false)
      return null;
    }
  }

  const pendingPercentage = (pendingSize / maxSize) * 100;
  const uploadedPercentage = (uploadedSize / maxSize) * 100;
  const remainingPercentage = 100 - pendingPercentage - uploadedPercentage;

  return (
    <div className="w-full max-w-md mx-auto bg-background">
      <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {t("form.dropzone")}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="mt-4 flex flex-col items-left">
            <p className="text-sm font-medium flex-grow text-muted-foreground">
              <Trans
                i18nKey="media-upload:form.size.uploaded"
                values={{ count: formatSize(uploadedSize) }}
                components={{ strong: <strong /> }}
              />
              {uploadedFiles && (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Badge variant="secondary" className="ml-2 cursor-pointer">
                      {t("dialog.badge", { count: uploadedFiles.length })}
                    </Badge>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{t("dialog.title")}</SheetTitle>
                      <SheetDescription>{t("dialog.description")}</SheetDescription>
                    </SheetHeader>
                    <FileTable
                      files={uploadedFiles}
                      isReadonly={true}
                      thumbnailFile={thumbnailFile}
                      setThumbnailFile={setThumbnailFile}
                      removeFile={() => { }}
                    />
                  </SheetContent>
                </Sheet>
              )}
              {', '}
              <br />
              <Trans
                i18nKey="media-upload:form.size.pending"
                values={{ count: formatSize(pendingSize) }}
                components={{ strong: <strong /> }}
              />{' '}
              <Trans
                i18nKey="media-upload:form.size.total"
                values={{ count: formatSize(pendingSize), limit: "25MB" }}
                components={{ strong: <strong /> }}
              />
            </p>

          </div>
          {isOverLimit && (
            <div className="flex items-center text-destructive mt-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{t("alert.overLimit", { limit: maxSize })}</span>
            </div>
          )}
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary float-left"
              style={{ width: `${uploadedPercentage}%` }}
            />
            <div
              className="h-full bg-tertiary float-left"
              style={{ width: `${pendingPercentage}%` }}
            />
            <div
              className="h-full bg-muted float-left"
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
        </div>
        {pendingFiles.length > 0 && (
          <FileTable
            files={pendingFiles.map(file => ({
              id: file.name,
              path: file.name,
              fullPath: file.name,
              name: file.name,
              size: file.size,
              isThumbnail: file.name === thumbnailFile
            }))}
            isReadonly={false}
            thumbnailFile={thumbnailFile}
            setThumbnailFile={setThumbnailFile}
            removeFile={removeFile}
          />
        )}
        <div className="flex mt-4 space-x-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  type="button"
                  variant="destructive-outline"
                  className="w-full"
                  onClick={resetFiles}
                  disabled={uploading || pendingFiles.length === 0}
                >
                  <RefreshCw className="h-4 w-4" aria-label="Reset" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("button.reset")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Separator orientation="vertical" className="h-6" />
          <Button
            type="submit"
            className="w-full font-bold"
            disabled={uploading || isOverLimit || pendingFiles.length === 0}
          >
            {uploading ? t("button.uploading") : t("button.upload")}
          </Button>
        </div>
        <div className="flex space-x-2 items-center">
          <p className="text-sm text-muted-foreground mt-4">
            {t("button.email_description")} <Link href={emailLink} className="text-primary hover:underline">
              {t("button.email")}
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
