import {
  ArtworkCreditInfoData,
  ArtworkCreditData,
} from "@/app/form-schemas/artwork-credit-info";

import { ArtworkInfoData } from "@/app/form-schemas/artwork-info";

import { writeArtworkInfo } from "@/app/actions/artwork/writeArtworkInfo";

export class ArtworkService {
  static async updateArtworkInfo(
    artworkId: string,
    data: Partial<ArtworkInfoData & ArtworkCreditInfoData>,
  ) {
    const { title, description, coartists } = data;

    return await writeArtworkInfo(artworkId, title || "", description || "");
  }
}
