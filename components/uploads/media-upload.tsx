"use client"

import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"
import { Reorder } from "framer-motion"
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { AlertCircle, MailIcon, RefreshCw, Trash2, Upload, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState, useMemo, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useQuery } from '@tanstack/react-query'
import { useTranslation, Trans } from 'react-i18next'

interface MediaUploadProps {
  artworkUUID?: string;
  emailLink: string;
  isNewArtwork: boolean;
  onUpload: (
    results: { id: string; path: string; fullPath: string; }[],
    errors: { message: string }[]
  ) => void;
}

export function MediaUpload({ artworkUUID, isNewArtwork, emailLink, onUpload }: MediaUploadProps) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [existingFiles, setExistingFiles] = useState<{ id: string; path: string; fullPath: string; name: string; size: number }[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; path: string; fullPath: string; name: string; size: number }[]>([])
  const [uploading, setUploading] = useState(false)
  const maxSize = 25 * 1024 * 1024 // 25MB in bytes
  const bucketName = 'artwork_assets'
  // I18n
  const { t } = useTranslation(['media-upload'])

  const { data: existingAssetsData } = useQuery({
    queryKey: ['existingAssets', artworkUUID],
    queryFn: async () => {
      if (isNewArtwork || !artworkUUID) return null;
      const supabase = createClient();
      // First get the list of files
      const { data: fileList, error } = await supabase
        .storage
        .from('artwork_assets')
        .list(artworkUUID);
      if (error) throw error;
      // Then get the size of each file
      const filesWithSizes = await Promise.all(fileList.map(async (file) => {
        try {
          const { data } = await supabase
            .storage
            .from('artwork_assets')
            .getPublicUrl(`${artworkUUID}/${file.name}`);
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          const size = parseInt(response.headers.get('Content-Length') || '0', 10);
          return { ...file, size };
        } catch (error) {
          console.error('Error getting public URL:', error);
          return { ...file, size: 0 };
        }
      }));
      return filesWithSizes;
    },
    enabled: !isNewArtwork && !!artworkUUID
  });

  useEffect(() => {
    if (existingAssetsData) {
      const existingFiles = existingAssetsData.map(asset => ({
        id: asset.id,
        path: asset.name,
        fullPath: `${artworkUUID}/${asset.name}`,
        name: `File ${asset.id}`,
        size: asset.size
      }));
      setExistingFiles(existingFiles);
    }
  }, [existingAssetsData, artworkUUID]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPendingFiles(prevFiles => [...prevFiles, ...acceptedFiles])
  }, [])

  const removeFile = (fileToRemove: File) => {
    setPendingFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove))
  }

  const resetFiles = () => {
    setPendingFiles([])
    if (isNewArtwork) {
      setExistingFiles([])
      setUploadedFiles([])
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name
    const extIndex = name.lastIndexOf('.')
    const ext = extIndex !== -1 ? name.slice(extIndex) : ''
    const truncatedName = name.slice(0, maxLength - ext.length - 3) + '...'
    return truncatedName + ext
  }

  const pendingSize = useMemo(() => pendingFiles.reduce((acc, file) => acc + file.size, 0), [pendingFiles]);
  const existingSize = useMemo(() => existingFiles.reduce((acc, file) => acc + file.size, 0), [existingFiles]);
  const uploadedSize = useMemo(() => uploadedFiles.reduce((acc, file) => acc + file.size, 0), [uploadedFiles]);
  const totalSize = pendingSize + existingSize + uploadedSize;

  const isOverLimit = totalSize > maxSize

  const handleUpload = async (): Promise<string | null> => {
    setUploading(true)
    try {
      const supabase = createClient()
      let results: { id: string; path: string; fullPath: string; }[] = [];
      let errors: { message: string }[] = [];
      let successCount = 0;
      let uploadedFilesList: { id: string; path: string; fullPath: string; name: string; size: number }[] = [];
      let remainingFiles: File[] = [];
      for (const file of pendingFiles) {
        const { data, error } = await supabase.storage.from(bucketName).upload(`${artworkUUID}/${file.name}`, file, { upsert: false })
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
            size: file.size 
          })
          successCount++;
        }
      }
      setUploadedFiles(prevFiles => [...prevFiles, ...uploadedFilesList]);
      setPendingFiles(remainingFiles);
      onUpload(uploadedFilesList, errors)
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
  const existingPercentage = (existingSize / maxSize) * 100;
  const uploadedPercentage = (uploadedSize / maxSize) * 100;
  const remainingPercentage = 100 - pendingPercentage - existingPercentage - uploadedPercentage;

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
          <div className="mt-4 flex items-center">
            <p className="text-sm font-medium flex-grow">
              <Trans
                i18nKey="media-upload:form.size.existing"
                values={{ count: formatSize(existingSize) }}
                components={{ strong: <strong /> }}
              />{', '}
              <Trans
                i18nKey="media-upload:form.size.uploaded"
                values={{ count: formatSize(uploadedSize) }}
                components={{ strong: <strong /> }}
              />{', '}
              <Trans
                i18nKey="media-upload:form.size.pending"
                values={{ count: formatSize(pendingSize) }}
                components={{ strong: <strong /> }}
              />{' '}
              <br />
              <Trans
                i18nKey="media-upload:form.size.total"
                values={{ count: formatSize(totalSize), limit: "25MB" }}
                components={{ strong: <strong /> }}
              />
              {(existingFiles.length > 0 || uploadedFiles.length > 0) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Badge variant="secondary" className="ml-2 cursor-pointer">
                      {t("dialog.badge", { count: existingFiles.length + uploadedFiles.length })}
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="max-h-[75vh] overflow-y-auto" >
                    <DialogHeader>
                      <DialogTitle>{t("dialog.title")}</DialogTitle>
                      <DialogDescription>
                        {t("dialog.description")}
                      </DialogDescription>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="mx-auto">{t("table.file")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <Reorder.Group axis="y" onReorder={setExistingFiles} values={existingFiles} className="w-full">
                          {existingFiles.map((file) => (
                            <Reorder.Item key={file.name} value={file} className="w-full" as="tr">
                              <TableCell className="flex items-center w-full">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mr-2" />
                                <div className="truncate">
                                  <span>{truncateFileName(file.name, 50)}</span>
                                  <br />
                                  <span className="text-muted-foreground">{formatSize(file.size)}</span>
                                </div>
                              </TableCell>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                        <Reorder.Group axis="y" onReorder={setUploadedFiles} values={uploadedFiles} className="w-full">
                          {uploadedFiles.map((file) => (
                            <Reorder.Item key={file.name} value={file} className="w-full" as="tr">
                              <TableCell className="flex items-center w-full">
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move mr-2" />
                                <div className="truncate">
                                  <span>{truncateFileName(file.name, 50)}</span>
                                  <br />
                                  <span className="text-muted-foreground">{formatSize(file.size)}</span>
                                </div>
                              </TableCell>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              )}
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
              style={{ width: `${existingPercentage}%` }}
            />
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
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.file")}</TableHead>
                <TableHead className="text-center">{t("table.remove")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingFiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center">
                    <div className="truncate">
                      <span>{truncateFileName(file.name)}</span>
                      <br />
                      <span className="text-muted-foreground">{formatSize(file.size)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      type="button"
                      className="text-destructive"
                      onClick={() => removeFile(file)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex mt-4 space-x-2 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                >
                  <Link href={emailLink}>
                    <MailIcon className="h-4 w-4" aria-label="Email Us" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("button.email")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      </form>
    </div>
  )
}
