"use client"
import React, { useEffect, useState } from 'react'
import { useFileUpload } from './files_uplooad_provider.component';
import { Progress } from '@/components/ui/progress';
const SIZE_LIMIT = 5;
export default function UploadInfo() {
  const { fileUploads } = useFileUpload();
  const [process, setProcess] = useState((calculateTotalFileSizeInMB(fileUploads) / SIZE_LIMIT * 100).toFixed(2));
  useEffect(() => {
    setProcess((calculateTotalFileSizeInMB(fileUploads) / SIZE_LIMIT).toFixed(2));
  }, [fileUploads])
  return (
    <div className='w-full min-h-[200px]'>
      <div className='flex gap-2 justify-between'>
        <h3 className='text-sm font-semibold uppercase'>Data usage</h3>
        <p>{fileUploads.length} files</p>
      </div>
      <Progress value={Number(process)} className='mt-2' />
      <span>{Number(process)}% of {SIZE_LIMIT}MB</span>
    </div>
  )
}


export function calculateTotalFileSizeInMB(files: File[]): number {
  const totalSizeInBytes = files.reduce((acc, file) => acc + file.size, 0);
  const totalSizeInMB = totalSizeInBytes / (1024 * 1024);
  return totalSizeInMB;
}