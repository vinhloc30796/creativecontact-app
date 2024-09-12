"use client"

// NextJS
import Link from 'next/link'
// ShadCN
import { AlertCircle, Upload } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Trans, useTranslation } from 'react-i18next'
// Custom
import { FileTable } from './FileTable'
// Types
import { SupabaseFile } from '@/app/types/SupabaseFile'
import { useThumbnail } from '@/contexts/ThumbnailContext'

interface MediaUploadProps {
  artworkUUID?: string;
  emailLink: string;
  isNewArtwork: boolean;
  onPendingFilesUpdate: (files: File[]) => void;
}

export function MediaUpload({ 
  artworkUUID, 
  isNewArtwork, 
  emailLink, 
  onPendingFilesUpdate,
}: MediaUploadProps) {
  console.log("MediaUpload component rendering", { artworkUUID, isNewArtwork, emailLink });
  // Constants
  const maxSize = 25 * 1024 * 1024 // 25MB in bytes
  
  // States
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const { thumbnailFileName, setThumbnailFileName } = useThumbnail();
  // I18n
  const { t } = useTranslation(['media-upload'])
  // Callbacks
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPendingFiles(prevFiles => {
      const newFiles = [...prevFiles, ...acceptedFiles];
      if (newFiles.length > 0 && !thumbnailFileName) {
        const newThumbnailFile = newFiles[0].name;
        setThumbnailFileName(newThumbnailFile);
      }
      // Pass the updated file list to the parent component
      onPendingFilesUpdate(newFiles);
      return newFiles;
    })
  }, [thumbnailFileName, onPendingFilesUpdate])
  // Remove a file from the pending files list
  const removeFile = (fileToRemove: File | SupabaseFile) => {
    setPendingFiles(prevFiles => {
      const newFiles = prevFiles.filter(file => file.name !== fileToRemove.name);
      if (thumbnailFileName === fileToRemove.name) {
        const newThumbnailFile = newFiles.length > 0 ? newFiles[0].name : null;
        setThumbnailFileName(newThumbnailFile);
      }
      // Pass the updated file list to the parent component
      onPendingFilesUpdate(newFiles);
      return newFiles;
    })
  }
  // Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const pendingSize = useMemo(() => pendingFiles.reduce((acc, file) => acc + file.size, 0), [pendingFiles]);
  const totalSize = pendingSize;

  const isOverLimit = totalSize > maxSize
  const pendingPercentage = (pendingSize / maxSize) * 100;
  const remainingPercentage = 100 - pendingPercentage;

  return (
    <div className="w-full max-w-md mx-auto bg-background">
      <form onSubmit={(e) => { e.preventDefault(); }}>
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
              className="h-full bg-primary float-left"
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
              isThumbnail: file.name === thumbnailFileName
            }))}
            isReadonly={false}
            removeFile={removeFile}
          />
        )}
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
