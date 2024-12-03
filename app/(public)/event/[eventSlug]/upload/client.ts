"use client";

// Types & Form schemas
import { ThumbnailSupabaseFile } from "@/app/types/SupabaseFile";
// Utils
import { normalizeFileNameForS3 } from "@/lib/s3_convention";
import { toNonAccentVietnamese } from "@/lib/vietnamese";
import { createClient } from "@/utils/supabase/client";

export const bucketName = "artwork_assets";

export const performUpload = async (
  artworkUUID: string,
  files: File[],
  thumbnailFileName: string,
  onProgress: (
    progress: number,
    uploadedCount: number,
    totalCount: number,
  ) => void,
) => {
  console.log(
    "[performUpload]: artworkUUID",
    artworkUUID,
    "thumbnailFileName",
    thumbnailFileName,
  );
  const supabase = createClient();
  let results: ThumbnailSupabaseFile[] = [];
  let errors: { message: string }[] = [];

  // List all files in the existing storage folder
  const { data: fileList, error } = await supabase.storage
    .from("artwork_assets")
    .list(artworkUUID);
  if (error) {
    console.error("Error listing files:", error.message);
    return { results, errors };
  }

  // Delete all files in the existing storage folder
  for (const file of fileList) {
    const { error: deleteError } = await supabase.storage
      .from("artwork_assets")
      .remove([`${artworkUUID}/${file.name}`]);
    if (deleteError) {
      console.error("Error deleting file:", deleteError.message);
      errors.push({ message: deleteError.message });
    }
  }
  if (errors.length > 0) {
    return { results, errors };
  }

  // Upload files
  let completedUploads = 0;
  const totalFiles = files.length;

  const uploadPromises = files.map(async (file, index) => {
    const normalizedFileName = normalizeFileNameForS3(
      toNonAccentVietnamese(file.name),
    );
    const { data, error } = await supabase.storage
      .from("artwork_assets")
      .upload(`${artworkUUID}/${normalizedFileName}`, file, {
        upsert: false,
      });

    // Update progress after each file upload
    completedUploads++;
    const progress = (completedUploads / totalFiles) * 100;
    onProgress(progress, completedUploads, totalFiles);

    return { data, error, file };
  });

  const uploadResults = await Promise.all(uploadPromises);

  const { results: uploadedResults, errors: uploadErrors } =
    uploadResults.reduce<{
      results: ThumbnailSupabaseFile[];
      errors: { message: string }[];
    }>(
      (acc, { data, error, file }) => {
        if (error) {
          console.error("[performUpload] Error uploading file:", error.message);
          acc.errors.push({ message: error.message });
        } else if (data) {
          console.log("[performUpload] File uploaded successfully:", data);
          const normalizedThumbnailFileName = normalizeFileNameForS3(
            toNonAccentVietnamese(thumbnailFileName),
          );
          const normalizedFileName = normalizeFileNameForS3(
            toNonAccentVietnamese(file.name),
          );
          const matched = normalizedFileName === normalizedThumbnailFileName;
          if (matched) {
            console.log(
              "[performUpload] matched",
              matched,
              "for file",
              file.name,
            );
          }
          acc.results.push({
            id: data.id,
            path: data.path,
            fullPath: data.fullPath,
            name: file.name,
            size: file.size,
            isThumbnail: matched,
          });
        } else {
          // This should never happen, but we handle it for completeness
          acc.errors.push({
            message: "[performUpload] Unexpected error occurred",
          });
        }
        return acc;
      },
      { results: [], errors: [] },
    );

  return {
    results: uploadedResults,
    errors: uploadErrors,
  };
};
