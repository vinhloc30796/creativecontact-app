import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import Image from 'next/image'
import React, { memo } from 'react'

interface MediaShowProps {
  url: string,
  typ: string,
  isThumbnail: boolean,
  setThumbnail: () => void,
  removeFile: () => void,
}
const MediaShow = (props: MediaShowProps) => {
  return (
    <div className='w-full relative'>
      <Button variant='secondary' className='absolute top-2 right-2 rounded-full' onClick={props.removeFile}>
        <Trash2Icon className='w-4 h-4' />
      </Button>
      {
        props.typ.startsWith("image") ?
          <Image src={props.url} alt="" width={400} height={300} className='w-full h-auto' /> :
          props.typ.startsWith("video") ?
            <video src={props.url} controls className='w-full h-auto' /> : <p>type not supported</p>
      }
      {
        !props.isThumbnail ?
          <Button variant='secondary' className='absolute bottom-2 right-2 rounded-full' onClick={props.setThumbnail}>
            Set as thumbnail
          </Button> : null
      }
    </div>
  )
}

export default memo(MediaShow)
