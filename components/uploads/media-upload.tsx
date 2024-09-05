"use client"

import { Button } from '@/components/ui/button'
import { Progress } from "@/components/ui/progress"
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { AlertCircle, MailIcon, RefreshCw, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface MediaUploadProps {
  artworkUUID?: string;
  emailLink: string;
  onUpload: (
    results: { id: string; path: string; fullPath: string; }[],
    errors: { message: string }[]
  ) => void;
}


export function MediaUpload({ artworkUUID, emailLink, onUpload }: MediaUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [totalSize, setTotalSize] = useState(0)
  const [uploading, setUploading] = useState(false)
  const maxSize = 25 * 1024 * 1024 // 25MB in bytes

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles]
    setFiles(newFiles)
    const newTotalSize = newFiles.reduce((acc, file) => acc + file.size, 0)
    setTotalSize(newTotalSize)
  }, [files])

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove)
    setFiles(newFiles)
    const newTotalSize = newFiles.reduce((acc, file) => acc + file.size, 0)
    setTotalSize(newTotalSize)
  }

  const resetFiles = () => {
    setFiles([])
    setTotalSize(0)
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
  const bucketName = 'artwork_assets'

  const handleUpload = async (): Promise<string | null> => {
    setUploading(true)
    try {
      const supabase = createClient()
      let results: { id: string; path: string; fullPath: string; }[] = [];
      let errors: { message: string }[] = [];
      for (const file of files) {
        const { data, error } = await supabase.storage.from(bucketName).upload(`${artworkUUID}/${file.name}`, file, { upsert: false })
        if (error) {
          console.error('Error uploading file:', error.message)
          toast.error("Error Uploading File", {
            description: `${file.name}: ${error.message}`,
            duration: 3000,
          })
          errors.push({ message: error.message })
        } else {
          console.log('Files uploaded successfully:', data)
          toast.success("File Uploaded", {
            description: `${file.name} has been successfully uploaded.`,
            duration: 3000,
          })
          results.push({ id: data.path, path: data.path, fullPath: data.fullPath })
        }
      }
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
              Using <span className="font-bold">{formatSize(totalSize)}</span> out of 25MB limit
            </p>
          </div>
          {isOverLimit && (
            <div className="flex items-center text-destructive mt-2">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Over the 25MB limit</span>
            </div>
          )}
          <Progress
            value={(totalSize / maxSize) * 100}
            className={`mt-2 ${isOverLimit ? "bg-destructive" : ""}`}
          />
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
