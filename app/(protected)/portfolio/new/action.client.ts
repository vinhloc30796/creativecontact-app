import {
  createPortfolioTransaction,
  insertArtworkAssetsTransaction,
} from "./transaction.actions";
import { createClient } from "@/utils/supabase/client";
import { performUpload } from "@/app/(public)/event/[eventSlug]/upload/client";
const supabase = createClient();

async function createPortfolio(
  artWorkData: {
    id: string;
    title: string;
    description: string;
  },
  portfolioData: {
    id?: string;
    displayOrder?: number;
    isHightlighted?: boolean;
  },
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("could not find user");
  }
  const result = await createPortfolioTransaction(
    { id: user.id },
    { ...artWorkData },
    { ...portfolioData },
  );
  return result;
}

async function deleteAllFileInArtwork(artworkId: string) {
  const { data, error } = await supabase.storage
    .from("artwork_assets")
    .list(artworkId);
  if (error) {
    return error;
  }
  const errors: Error[] = [];
  for (const file of data) {
    const { error } = await supabase.storage
      .from("artwork_assets")
      .remove([`${artworkId}/${file.name}`]);
    if (error) {
      errors.push(error);
    }
  }
  return errors.length > 0 ? errors : null;
}

export const addArtworkAssets = async (
  artworkId: string,
  files: File[],
  thumbnailFileName: string,
  onProgress?: (
    progress: number,
    uploadedCount: number,
    totalCount: number,
  ) => void,
) => {
  const { results, errors } = await performUpload(
    artworkId,
    files,
    thumbnailFileName,
    onProgress ?? (() => {}),
  );
  if (errors) {
    return {
      data: null,
      errors,
    };
  }
  const rs = await insertArtworkAssetsTransaction(artworkId, results!);
  if (rs.errors || rs.data.length === 0) {
    await deleteAllFileInArtwork(artworkId);
    return {
      data: null,
      errors: rs.errors || [new Error("could not insert artwork assets")],
    };
  }
  return {
    data: true,
    errors: null,
  };
};

export const handleSubmit = async (
  artWorkData: {
    id: string;
    title: string;
    description: string;
  },
  portfolioData: {
    id: string;
    displayOrder?: number;
    isHightlighted?: boolean;
  },
  files: File[],
  thumbnailFileName: string,
  onProgress?: (
    progress: number,
    uploadedCount: number,
    totalCount: number,
  ) => void,
) => {
  const result = await createPortfolio(artWorkData, portfolioData);
  if (!result.artwork.id) {
    return new Error("[handlerSubmit] could not create portfolio");
  } else {
    console.log(
      "[handlerSubmit] created portfolio with portfolioId",
      result.portfolioArtwork.id,
      "and artworkId",
      result.artwork.id,
    );
  }
  const rs = await addArtworkAssets(
    artWorkData.id,
    files,
    thumbnailFileName,
    onProgress,
  );
  if (rs.errors) {
    return rs.errors;
  }
  return true;
};
