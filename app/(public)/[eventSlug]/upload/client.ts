"use client";

// Types & Form schemas
import { ThumbnailSupabaseFile } from "@/app/types/SupabaseFile";
// Utils
import { normalizeFileNameForS3 } from '@/lib/s3_convention';
import { toNonAccentVietnamese } from '@/lib/vietnamese';
import { createClient } from "@/utils/supabase/client";

export const bucketName = 'artwork_assets'

export const performUpload = async (
  artworkUUID: string,
  files: File[],
  thumbnailFileName: string
) => {
  console.log("performUpload: artworkUUID", artworkUUID, "thumbnailFileName", thumbnailFileName);
  const supabase = createClient();
  let results: ThumbnailSupabaseFile[] = [];
  let errors: { message: string }[] = [];

  // List all files in the existing storage folder
  const { data: fileList, error } = await supabase
    .storage
    .from('artwork_assets')
    .list(artworkUUID);
  if (error) {
    console.error('Error listing files:', error.message);
    return { results, errors };
  }

  // Delete all files in the existing storage folder
  for (const file of fileList) {
    const { error: deleteError } = await supabase
      .storage
      .from('artwork_assets')
      .remove([`${artworkUUID}/${file.name}`]);
    if (deleteError) {
      console.error('Error deleting file:', deleteError.message);
      errors.push({ message: deleteError.message });
    }
  }
  if (errors.length > 0) {
    return { results, errors };
  }

  // Upload files
  for (const file of files) {
    const normalizedFileName = normalizeFileNameForS3(toNonAccentVietnamese(file.name));
    const { data, error } = await supabase.storage
      .from('artwork_assets')
      .upload(`${artworkUUID}/${normalizedFileName}`, file, { upsert: false });

    if (error) {
      console.error('Error uploading file:', error.message);
      errors.push({ message: error.message });
    } else {
      console.log('File uploaded successfully:', data);
      const normalizedThumbnailFileName = normalizeFileNameForS3(toNonAccentVietnamese(thumbnailFileName));
      const matched = normalizedFileName === normalizedThumbnailFileName;
      if (matched) {
        console.log("matched", matched, "for file", file.name);
      }
      results.push({
        id: data.path,
        path: data.path,
        fullPath: data.fullPath,
        name: normalizedFileName,
        size: file.size,
        isThumbnail: matched
      });
    }
  }

  return { results, errors };
};