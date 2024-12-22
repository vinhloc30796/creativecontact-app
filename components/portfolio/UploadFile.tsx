"use client";
import React, { createContext, useCallback, useContext, useState } from 'react'
import { useTranslation } from '@/lib/i18n/init-client';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { deleteMediaFile, UploadedMediaFileType, UploadMediaFile } from '@/lib/uploadMediaFile';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

// Context
interface UploadMediaContextType {
  getfiles: () => UploadedMediaFileType[],
  addFiles: (files: UploadedMediaFileType[]) => void
  setThumbnail: (uploadedFileId: string) => void
  updateDecription: (fileId: string, description: string) => void
  removeFile: (uploadedFileId: string) => void
  getDataUsage: () => number
}
const UploadMediaContext = createContext<UploadMediaContextType>({
  getfiles: () => [],
  addFiles: () => { },
  setThumbnail: () => { },
  updateDecription: () => { },
  removeFile: () => { },
  getDataUsage: () => 0
})

const useUploadMedia = () => useContext(UploadMediaContext)

// Provider
export function UploadMediaProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<UploadedMediaFileType[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dataUsage', files],
    queryFn: async () => {
      const response = await fetch('/api/storage/usage')
      if (!response.ok) {
        throw new Error('Failed to fetch data usage')
      }
      return response.json()
    }
  })


  const addFiles = (newFiles: UploadedMediaFileType[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const setThumbnail = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.map(file => {
      if (file.id === fileId) {
        return { ...file, isThumbnail: true }
      }
      return { ...file, isThumbnail: false }
    }))
    setFiles((prevFiles) => {
      return prevFiles.sort((a, b) => {
        const aValue = a.isThumbnail ? 1 : 0;
        const bValue = b.isThumbnail ? 1 : 0;
        return bValue - aValue;
      })

    })
  }

  const removeFile = (fileId: string) => {
    deleteMediaFile(files.find(file => file.id === fileId)!.path)
    setFiles((prevFiles) => prevFiles.filter(file => file.id !== fileId));
  }

  const updateDecription = (fileId: string, description: string) => {
    setFiles((prevFiles) => prevFiles.map(file => {
      if (file.id === fileId) {
        return { ...file, description }
      }
      return file
    }))
  }

  const getDataUsage = () => {
    return data?.result as number
  }
  return (
    <UploadMediaContext.Provider value={{
      getfiles: () => files,
      addFiles,
      setThumbnail,
      updateDecription,
      removeFile,
      getDataUsage
    }}>
      {children}
    </UploadMediaContext.Provider>
  )
}

// UI upload file
interface UploadFileProps {
  path: string,
  lang?: string
}
function UploadFile({ lang, path }: UploadFileProps) {
  const { t } = useTranslation(lang || "en", "media-upload")
  const [uploadProcess, setUploadProcess] = useState<number | null>(null)

  const { addFiles } = useUploadMedia()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // logic uploadfile
    setUploadProcess(0)
    const rs = await UploadMediaFile(acceptedFiles, path, (progress, _uploadCount, _total) => {
      setUploadProcess(progress)
    })
    console.info(rs)
    if (rs.errors) {
      console.error(rs.errors)
      toast.error(t("toast.error.title"), { duration: 5000 })
    } else {
      toast.success(t("toast.success.title"))
      addFiles(rs.results || [])
    }
    setUploadProcess(null)
  }, [setUploadProcess, path, t, addFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div className='mx-auto w-full bg-background p-4'>

      <form
        onSubmit={(e) => e.preventDefault()}
        className='relative border-4 border-dashed border-border border-gray-300 rounded-xl flex flex-col items-center justify-center p-4'
      >
        {
          uploadProcess !== null &&
          <div className='absolute top-0 left-0 right-0 bottom-0 h-full w-full flex justify-center items-center backdrop-blur'>
            <Progress value={uploadProcess} className="w-[60%]" />
          </div>
        }
        <div
          {...getRootProps()}
          className={cn(`cursor-pointer p-8 text-center transition-colors flex items-center justify-center flex-col max-w-3xl mx-auto`,
            isDragActive ? "border-primary bg-primary/10" : "border-border")}
        >
          <input {...getInputProps()} />
          <Upload className='w-8 h-8' />
          <p className='text-sm text-muted-foreground mt-2'>{t("form.dropzone")}</p>
        </div>
        <div className='flex items-center space-x-2 text-sm gap-2 lg:gap-8'>
          <p>{t("supportFile.title")}</p>
          <ul style={{ listStyleType: "disc" }}>
            <li>{t("supportFile.images")}</li>
            <li>{t("supportFile.videos")}</li>
            <li>{t("supportFile.audios")}</li>
          </ul>
        </div>
      </form>
    </div>
  )
}

function DataUsageView() {
  const { getDataUsage } = useUploadMedia()
  const dataUsage = (getDataUsage() / (1024 * 1024))
  return (
    <div
      className={cn('flex flex-col gap-2',
        dataUsage > 25 ? " text-red-500" : "text-muted-foreground"
      )}>
      <p className='text-sm'>{dataUsage.toFixed(2)} of 25 MB used</p>
      <Progress value={(dataUsage) / 25 * 100} className={cn("w-full h-2", dataUsage > 25 ? "bg-red-500" : "")} />
    </div>
  )
}

export {
  UploadFile,
  type UploadMediaContextType,
  UploadMediaContext,
  useUploadMedia,
  DataUsageView,
}