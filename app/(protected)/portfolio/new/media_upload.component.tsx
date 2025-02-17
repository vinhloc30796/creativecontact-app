import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react'
import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next'
import { useFileUpload } from './files_uplooad_provider.component';
import MediaShow from './media.component';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectItem } from '@radix-ui/react-select';
import { isThursday } from 'date-fns';

interface MediaUploadComponentProps {
}
export function MediaUploadComponent(props: MediaUploadComponentProps) {

  const { fileUploads, addFiles, removeFile, thumbnailFileName, setThumbnailFileName } = useFileUpload()
  const onDrop = useCallback((acceptedFiles: File[]) => {
    addFiles(acceptedFiles)
    return [...fileUploads, ...acceptedFiles]
  }, [addFiles, fileUploads])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
    },
  })

  const { t } = useTranslation(["media-upload"])
  return (
    <div className='w-full mx-auto'>
      <div
        {...getRootProps()}
        className={cn(`cursor-pointer rounded-md border-2 border-dashed p-8 text-center transition-colors flex items-center justify-center flex-col max-w-3xl mx-auto`,
          isDragActive ? "border-primary bg-primary/10" : "border-border")}
      >
        <input {...getInputProps()} />
        <Upload className='w-8 h-8' />
        <p className='text-sm text-muted-foreground mt-2'>{t("form.dropzone")}</p>

      </div>
      <div className='mt-4 flex flex-col gap-4 mb-4'>
        {
          fileUploads.map(f => ({
            url: URL.createObjectURL(f),
            name: f.name,
            typ: f.type
          })).map((f, i) => (
            <MediaShow key={i}
              url={f.url} typ={f.typ}
              removeFile={() => removeFile(f.name)}
              isThumbnail={f.name === thumbnailFileName}
              setThumbnail={() => setThumbnailFileName(f.name)}
            />
          ))
        }
      </div>
    </div>
  )
}
