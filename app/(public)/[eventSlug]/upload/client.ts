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
  const uploadPromises = files.map(async (file) => {
    const normalizedFileName = normalizeFileNameForS3(toNonAccentVietnamese(file.name));
    return supabase.storage
      .from('artwork_assets')
      .upload(`${artworkUUID}/${normalizedFileName}`, file, { upsert: false });
  });

  const uploadResults = await Promise.all(uploadPromises);

  const { results: uploadedResults, errors: uploadErrors } = uploadResults.reduce<{ results: ThumbnailSupabaseFile[], errors: { message: string }[] }>(
    (acc, result, index) => {
      if (result.error) {
        console.error('Error uploading file:', result.error.message);
        acc.errors.push({ message: result.error.message });
      } else if (result.data) {
        console.log('File uploaded successfully:', result.data);
        const normalizedThumbnailFileName = normalizeFileNameForS3(toNonAccentVietnamese(thumbnailFileName));
        const normalizedFileName = normalizeFileNameForS3(toNonAccentVietnamese(files[index].name));
        const matched = normalizedFileName === normalizedThumbnailFileName;
        if (matched) {
          console.log("matched", matched, "for file", files[index].name);
        }
        acc.results.push({
          id: result.data.path,
          path: result.data.path,
          fullPath: result.data.fullPath,
          name: result.data.path,
          size: files[index].size,
          isThumbnail: matched
        });
      } else {
        // This should never happen, but we handle it for completeness
        acc.errors.push({ message: "Unexpected error occurred" });
      }
      return acc;
    },
    { results: [], errors: [] }
  );

  return { results: uploadedResults, errors: uploadErrors };
};
