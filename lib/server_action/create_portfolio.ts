"use server"
import { UploadedMediaFileType } from "../client/uploadMediaFile"
import { getPortfolioUsecase } from "../services/portfolio"

export async function createPortfolio(
  createPortfolioData: {
    id: string,
    title: string,
    description: string
    displayOrder?: number
    isHightlighted?: boolean
  },
  artworkAssets: UploadedMediaFileType[]
) {
  return await getPortfolioUsecase().cratePortfolio(createPortfolioData, artworkAssets)
}