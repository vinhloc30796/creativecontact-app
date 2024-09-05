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
  const [files, setFiles] = useState<File[]>([])
  const [totalSize, setTotalSize] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number }[]>([])
  const maxSize = 25 * 1024 * 1024 // 25MB in bytes
  const bucketName = 'artwork_assets'

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
        name: `File ${asset.id}`,
        size: asset.size
      }));
      setUploadedFiles(existingFiles);
      const existingTotalSize = existingAssetsData.reduce((acc, asset) => acc + asset.size, 0);
      setTotalSize(existingTotalSize);
    }
  }, [existingAssetsData]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles]
    setFiles(newFiles)
    const newTotalSize = newFiles.reduce((acc, file) => acc + file.size, 0) + totalSize
    setTotalSize(newTotalSize)
  }, [files, totalSize])

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove)
    setFiles(newFiles)
    const newTotalSize = newFiles.reduce((acc, file) => acc + file.size, 0) + 
      uploadedFiles.reduce((acc, file) => acc + file.size, 0)
    setTotalSize(newTotalSize)
  }

  const resetFiles = () => {
    setFiles([])
    if (isNewArtwork) {
      setTotalSize(0)
      setUploadedFiles([])
    } else {
      const existingTotalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0)
      setTotalSize(existingTotalSize)
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

  const isOverLimit = totalSize > maxSize

  const handleUpload = async (): Promise<string | null> => {
    setUploading(true)
    try {
      const supabase = createClient()
      let results: { id: string; path: string; fullPath: string; }[] = [];
      let errors: { message: string }[] = [];
      let successCount = 0;
      let uploadedFilesList: { name: string; size: number }[] = [];
      let remainingFiles: File[] = [];
      for (const file of files) {
        const { data, error } = await supabase.storage.from(bucketName).upload(`${artworkUUID}/${file.name}`, file, { upsert: false })
        if (error) {
          console.error('Error uploading file:', error.message)
          toast.error("Error Uploading File", {
            description: `${file.name}: ${error.message}`,
            duration: 3000,
          })
          errors.push({ message: error.message })
          remainingFiles.push(file)
        } else {
          console.log('Files uploaded successfully:', data)
          toast.success("File Uploaded", {
            description: `${file.name} has been successfully uploaded.`,
            duration: 3000,
          })
          results.push({ id: data.path, path: data.path, fullPath: data.fullPath })
          uploadedFilesList.push({ name: file.name, size: file.size })
          successCount++;
        }
      }
      setUploadedFiles(prevFiles => [...prevFiles, ...uploadedFilesList]);
      setFiles(remainingFiles);
      setTotalSize(prevSize => prevSize - uploadedFilesList.reduce((acc, file) => acc + file.size, 0));
      onUpload(results, errors)
      return artworkUUID || null
    } catch (error) {
      console.error('Error uploading files:', error)
      return null;
    } finally {
      setUploading(false)
      return null;
    }
  }

  const pendingSize = useMemo(() => files.reduce((acc, file) => acc + file.size, 0), [files]);
  const uploadedSize = useMemo(() => uploadedFiles.reduce((acc, file) => acc + file.size, 0), [uploadedFiles]);
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
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        </div>
        <div className="flex flex-col">
          <div className="mt-4 flex items-center">
            <p className="text-sm font-medium flex-grow">
              <span className="font-bold">{formatSize(uploadedSize)}</span> uploaded,{' '}
              <span className="font-bold">{formatSize(pendingSize)}</span> pending.{' '}<br />
              Total: <span className="font-bold">{formatSize(uploadedSize + pendingSize)}</span> of 25MB limit{uploadedFiles.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Badge variant="secondary" className="ml-2 cursor-pointer">
                      {uploadedFiles.length} files uploaded
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="max-h-[75vh] overflow-y-auto" >
                    <DialogHeader>
                      <DialogTitle>Uploaded Files</DialogTitle>
                      <DialogDescription>
                        This reordering is for fun.
                        It doesn't affect the order of the files in the database.
                      </DialogDescription>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="mx-auto">File</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
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
              <span className="text-xs">Over the 25MB limit</span>
            </div>
          )}
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary float-left"
              style={{ width: `${uploadedPercentage}%` }}
            />
            <div
              className="h-full bg-secondary float-left"
              style={{ width: `${pendingPercentage}%` }}
            />
            <div
              className="h-full bg-muted float-left"
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
        </div>

        {files.length > 0 && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead className="text-center">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file, index) => (
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
              <TooltipContent>Email Us</TooltipContent>
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
                  disabled={uploading || files.length === 0}
                >
                  <RefreshCw className="h-4 w-4" aria-label="Reset" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Separator orientation="vertical" className="h-6" />
          <Button
            type="submit"
            className="w-full font-bold"
            disabled={uploading || isOverLimit || files.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      </form>
    </div>
  )
}
