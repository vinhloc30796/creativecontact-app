import { ThumbnailSupabaseFile } from "@/app/types/SupabaseFile";
import { createPortfolioTransaction, insertArtworkAssetsTransaction } from "./transaction.actions";
import { createClient } from "@/utils/supabase/client";
import { normalizeFileNameForS3 } from "@/lib/s3_convention";
import { toNonAccentVietnamese } from "@/lib/vietnamese";
const supabase = createClient()
async function createPortfolio(
  artWorkData: {
    title: string,
    description: string
  },
  portfolioData: {
    displayOrder?: number
    isHightlighted?: boolean
  }
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("could not find user");
  }
  const result = await createPortfolioTransaction(
    { id: user.id },
    { ...artWorkData },
    { ...portfolioData }
  );
  return result
}

async function deleteAllFileInArtwork(artworkId: string) {
  const { data, error } = await supabase
    .storage
    .from('artwork_assets')
    .list(artworkId)
  if (error) {
    return error
  }
  const errors: Error[] = []
  for (const file of data) {
    const { error } = await supabase
      .storage
      .from('artwork_assets')
      .remove([`${artworkId}/${file.name}`]);
    if (error) {
      errors.push(error)
    }
  }
  return errors.length > 0 ? errors : null
}

async function uploadFile(artworkId: string, files: File[], thumbnailFileName: string) {
  const errors = await deleteAllFileInArtwork(artworkId);
  if (errors) {
    return {
      results: null,
      errors
    }
  }

  const normalizedThumbnailFileName = normalizeFileNameForS3(toNonAccentVietnamese(thumbnailFileName));
  const uploadPromies = files.map(async (file) => {
    const normalizedFileName = normalizeFileNameForS3(toNonAccentVietnamese(file.name));
    const { data, error } = await supabase
      .storage
      .from('artwork_assets')
      .upload(`${artworkId}/${normalizedFileName}`, file, { upsert: false });
    return { data, error, file }
  })

  const uploadResults = await Promise.all(uploadPromies);
  return uploadResults.reduce<{ results: ThumbnailSupabaseFile[] | null, errors: Error[] | null }>(
    (acc, { data, error, file }) => {
      if (error) {
        if (acc.errors === null) {
          acc.errors = [];
        }
        acc.errors.push(error);
      } else if (data) {
        if (acc.results === null) {
          acc.results = [];
        }

        const normalizedFileName = normalizeFileNameForS3(toNonAccentVietnamese(file.name));
        const matched = normalizedFileName === normalizedThumbnailFileName;

        acc.results.push({
          id: data.id,
          path: data.path,
          fullPath: data.fullPath,
          name: file.name,
          size: file.size,
          isThumbnail: matched,
        });
      }
      else {
        if (acc.errors === null) {
          acc.errors = [];
        }
        acc.errors.push(new Error('unknown error when uploading file'));
      }
      return acc
    }, { results: [], errors: null });
}

export const addArtworkAssets = async (artworkId: string, files: File[], thumbnailFileName: string) => {
  const { results, errors } = await uploadFile(artworkId, files, thumbnailFileName);
  if (errors) {
    return {
      data: null,
      errors
    }
  }
  const rs = await insertArtworkAssetsTransaction(artworkId, results!);
  if (rs.errors || rs.data.length === 0) {
    await deleteAllFileInArtwork(artworkId);
    return {
      data: null,
      errors: rs.errors || [new Error("could not insert artwork assets")]
    }
  }
  return {
    data: true,
    errors: null
  }
}

export const handlerSubmit = async (artWorkData: {
  title: string,
  description: string
}, portfolioData: {
  displayOrder?: number
  isHightlighted?: boolean
},
  files: File[],
  thumbnailFileName: string
) => {
  const result = await createPortfolio(artWorkData, portfolioData);
  if (!result.artwork.id) {
    return new Error("could not create portfolio");
  }
  const rs = await addArtworkAssets(result.artwork.id, files, thumbnailFileName);
  if (rs.errors) {
    return rs.errors;
  }
  return true
}