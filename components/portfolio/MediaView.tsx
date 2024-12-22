"use client";
import { UploadedMediaFileType } from '@/lib/uploadMediaFile'
import { useTranslation } from '@/lib/i18n/init-client'
import { getFileUrlFromPath } from '@/utils/get_file_url';
import Image from 'next/image';
import React, { useState, useRef } from 'react'
import { useUploadMedia } from './UploadFile';
import { Button } from '../ui/button';
import { Check, Edit, Trash2 } from 'lucide-react';
import { desc } from 'drizzle-orm';

interface MediaViewProps {
  // lang: string,
  fileData: UploadedMediaFileType
}
function MediaView(props: MediaViewProps) {
  // const { t } = useTranslation(props.lang || 'en', 'ArtworkCreditInfoStep')
  const { removeFile, updateDecription, setThumbnail } = useUploadMedia()
  const [editMode, setEditMode] = useState(false)
  const [description, setDescription] = useState(props.fileData.description)
  const remove = () => {
    removeFile(props.fileData.id)
  }
  const update = () => {
    updateDecription(props.fileData.id, description || "")
    setEditMode(false)
  }
  return (
    <div className='container w-full flex flex-col gap-2 border bg-gray-200 border-gray-400 border-2 rounded-xl p-2'>
      <div className='w-full relative min-h-8'>
        {
          !editMode ?
            (<>
              <Button variant='ghost' className='absolute top-0 right-0 p-0 m-0' asChild onClick={remove}><Trash2 className='h-4 w-4' /></Button>
              <p className='text-sm text-muted-foreground items-center'>
                {props.fileData.isThumbnail ?
                  <span className='text-xs text-white bg-red-500 px-2 py-1 rounded-full mr-2'>Thumbnail</span> : null}
                {props.fileData.description}
                <Button variant="ghost" className='p-0 m-0 ml-2' onClick={() => setEditMode(true)} asChild>
                  <Edit className='h-4 w-4' />
                </Button>
              </p>
            </>)
            : (
              <div className="w-full flex flex-col gap-22">
                <textarea value={description}
                  placeholder='description'
                  onChange={(e) => { setDescription(e.target.value) }}
                  className='bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                />
                <div className="w-full flex justify-between">
                  {
                    !props.fileData.isThumbnail ?
                      <Button variant='ghost' onClick={() => {
                        update()
                        setThumbnail(props.fileData.id)
                      }}>Set as thumbnail</Button> : <div></div>
                  }
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
  lang: string,
}

function MediasView({ lang }: MediasViewProps) {
  const { getfiles } = useUploadMedia()
  const files = getfiles()
  return (
    <div className='flex flex-col gap-4'>
      {
        files.map((file) => {
          return <MediaView key={file.id} fileData={file} />
        })
      }
    </div>
  )
}

export {
  MediaView,
  MediasView
}