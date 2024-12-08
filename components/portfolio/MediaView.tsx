"use client";
import { UploadedMediaFileType } from '@/lib/client/uploadMediaFile'
import { useTranslation } from '@/lib/i18n/init-client'
import { getFileUrlFromPath } from '@/utils/get_file_url';
import Image from 'next/image';
import React, { useState, useRef } from 'react'
import { useUploadMedia } from './UploadFile';
import { Button } from '../ui/button';
import { Check, Edit } from 'lucide-react';

interface MediaViewProps {
  lang?: string,
  fileData: UploadedMediaFileType
}
function MediaView(props: MediaViewProps) {
  const { t } = useTranslation(props.lang || 'en', 'ArtworkCreditInfoStep')
  const { removeFile, updateDecription, setThumbnail } = useUploadMedia()
  const [editMode, setEditMode] = useState(false)
  const inputValue = useRef<HTMLTextAreaElement>(null)
  const remove = () => {
    removeFile(props.fileData.id)
  }
  const update = () => {
    const description = inputValue.current?.value || ""
    updateDecription(props.fileData.id, description)
    setEditMode(false)
  }
  return (
    <div className='container w-full flex flex-col gap-2 border bg-gray-200 border-gray-400 border-2 rounded-xl p-2'>
      <div className='w-full relative min-h-8'>
        {
          !editMode ?
            (<>
              <Button variant='ghost' className='absolute top-0 right-0 ' onClick={remove}>x</Button>
              <p className='text-sm text-muted-foreground items-center'>
                <Button variant='ghost'
                  onClick={() => setEditMode(true)}
                ><Edit className='h-4 w-4' /></Button>
                {props.fileData.description}
              </p>
            </>)
            : (
              <div className="w-full flex flex-col gap-22">
                <textarea value={props.fileData.description}
                  placeholder='description' ref={inputValue}
                  className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                />
                <div className="w-full flex justify-between">
                  <Button variant='ghost' onClick={() => setThumbnail(props.fileData.id)}>Set as thumbnail</Button>
                  <Button variant='ghost'
                    onClick={update}
                  ><Check className='h-4 w-4' /></Button>
                </div>
              </div>
            )
        }
      </div>
      <div className='relative w-full'>
        {
          props.fileData.type === 'image' ? (
            <Image src={getFileUrlFromPath(props.fileData.fullPath)}
              className='object-cover'
              width={0}
              height={0}
              sizes='100vw'
              style={{ width: '100%', height: 'auto' }}
              alt={props.fileData.description || ''} />
          ) : (
            props.fileData.type === 'video' ?
              <video src={getFileUrlFromPath(props.fileData.fullPath)} width="full" height="auto" controls /> : (
                props.fileData.type === 'audio' ?
                  <audio src={getFileUrlFromPath(props.fileData.fullPath)} controls /> : <p>type not supported</p>
              )
          )
        }
      </div>
    </div>
  )
}

interface MediasViewProps {
  lang?: string,
}

function MediasView({ lang }: MediasViewProps) {
  const { getfiles } = useUploadMedia()
  const files = getfiles()
  return (
    <div className='flex flex-col gap-4'>
      {
        files.map((file) => {
          return <MediaView key={file.id} lang={lang} fileData={file} />
        })
      }
    </div>
  )
}

export {
  MediaView,
  MediasView
}