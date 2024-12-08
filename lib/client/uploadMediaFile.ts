import { ThumbnailSupabaseFile } from "@/app/types/SupabaseFile";
import { createClient } from "@/utils/supabase/client";
import { normalizeFileNameForS3 } from "../s3_convention";
import { toNonAccentVietnamese } from "../vietnamese";
import { getFileType, isMediaFile } from "@/utils/file_type";



export const bucketMediafileName = 'artwork_assets'

export interface UploadedMediaFileType extends ThumbnailSupabaseFile {
  type: "image" | "video" | "audio" | "font" | null,
  description: string
}

/**
 * Upload a list of media files to Supabase.
 * The function first check if all files are media files. If not, it will return an error.
 * After that, it will upload the given files and return a list of uploaded files.
 * If any error occur during the process, it will return an error.
 * @param files a list of media files to upload
 * @param path the path to upload the files
 * @param onProgress a callback to report the progress of the upload
 * @returns a promise that resolves to an object with two properties: results and errors.
 * results is an array of ThumbnailSupabaseFile objects, which contains the uploaded files.
 * errors is an array of Error objects, which contains the errors that occurred during the process.
 * if no errors occurred, errors will be null
 */
async function UploadMediaFile(
  files: File[],
  path: string,
  onProgress: (progress: number, uploadedCount: number, totalCount: number) => void
): Promise<{ results: UploadedMediaFileType[] | null, errors: Error[] | null }> {
  // verify files is media file 
  const err = files.filter((file) => {
    return !isMediaFile(file)
  }).map((file) => {
    return new Error(`${file.name} is not a media file`)
  })
  if (err.length > 0) {
    return { results: null, errors: err }
  }

  const supabaseClient = createClient();

  // check bucket exist
  const { data: listFile, error } = await supabaseClient
    .storage
    .from(bucketMediafileName)
    .list(path);
  if (error) {
    console.log(error);
    return { results: null, errors: [error] }
  }

  /*   // delete all file in bucket
    for (const f of listFile) {
      const { error: deleteError } = await supabaseClient
        .storage
        .from(bucketMediafileName)
        .remove([`${path}/${f.name}`]);
      if (deleteError) {
        console.log(deleteError);
        return { results: null, errors: [deleteError] }
      }
    } */

  // upload files
  let completedUploads = 0
  const totalFiles = files.length

  const uploadPromies = files.map(async (file) => {
    const normalizedFileName = `${Date.now()}_${normalizeFileNameForS3(toNonAccentVietnamese(file.name))}`;
    const { data, error } = await supabaseClient
      .storage
      .from(bucketMediafileName)
      .upload(`${path}/${normalizedFileName}`, file, { upsert: true });

    completedUploads++
    const progress = (completedUploads / totalFiles) * 100
    onProgress(progress, completedUploads, totalFiles)
    return { data, error, file }
  })

  const uploadReults = await Promise.all(uploadPromies);

  const { results, errors } = uploadReults.reduce<{ results: UploadedMediaFileType[], errors: Error[] }>(
    (acc, { data, error, file }) => {
      if (error) {
        acc.errors.push(error)
      } else if (data) {
        acc.results.push({
          id: data.id,
          path: data.path,
          fullPath: `${bucketMediafileName}/${data.path}`,
          isThumbnail: false,
          type: getFileType(file),
          name: file.name,
          size: file.size,
          description: ""
        })
      } else {
        acc.errors.push(new Error(`could not upload file ${file.name}`))
      }
      return acc
    }, { results: [], errors: [] })
  return { results, errors: errors.length > 0 ? errors : null }
}

async function deleteMediaFile(path: string) {
  const supabaseClient = createClient();
  const { error: deleteError } = await supabaseClient
    .storage
    .from(bucketMediafileName)
    .remove([path]);
  if (deleteError) {
    console.log(deleteError);
    return { results: null, errors: [deleteError] }
  }
  return { results: "true", errors: null }
}


export {
  UploadMediaFile,
  deleteMediaFile
}