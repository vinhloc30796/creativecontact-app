import { artworkAssets as artwork_assets, artworkCredits, artworks, assetTypeEnum } from "@/drizzle/schema/artwork"
import { portfolioArtworks } from "@/drizzle/schema/portfolio"
import { UploadedMediaFileType } from "@/lib/client/uploadMediaFile"
import { DB } from "@/lib/db"
import { createClient } from "@/utils/supabase/server"
import { eq, max } from "drizzle-orm"

interface PortfolioUserCase {
  cratePortfolio(
    createPortfolioData: {
      id: string,
      title: string,
      description: string
      displayOrder?: number
      isHightlighted?: boolean
    },
    artworkAssets: UploadedMediaFileType[]
  ): Promise<{ result: boolean, error: Error | null }>
}
class PortfolioUserCaseImpl implements PortfolioUserCase {
  constructor(
    private db: DB,
  ) { }
  async cratePortfolio(
    createPortfolioData: {
      id: string,
      title: string,
      description: string
      displayOrder?: number
      isHightlighted?: boolean
    },
    artworkAssets: UploadedMediaFileType[]
  ): Promise<{ result: boolean, error: Error | null }> {
    const userIdData = await this.getUserId()
    if (userIdData.error) {
      return { result: false, error: userIdData.error }
    }
    const userId = userIdData.result
    try {
      await this.db.transaction(async (tx) => {
        const [artwork] = await tx.insert(artworks).values({
          id: createPortfolioData.id,
          title: createPortfolioData.title,
          description: createPortfolioData.description,
        }).returning()

        await tx.insert(artworkCredits).values({
          artworkId: createPortfolioData.id,
          userId: userId,
          title: "Artist"
        })

        await tx.insert(artwork_assets).values(
          artworkAssets.map(asset => ({
            artworkId: createPortfolioData.id,
            filePath: asset.path,
            assetType: asset.type,
            description: asset.description,
            isThumbnail: asset.isThumbnail,
          }))
        )

        const { result: maxDisplayOrder } = await this.getMaxDisplayOrder()
        const displayOrder = maxDisplayOrder ? maxDisplayOrder + 1 : 1;
        await tx.insert(portfolioArtworks).values({
          userId: userId,
          artworkId: artwork.id,
          displayOrder: displayOrder
        }).returning()

      })
      return { result: true, error: null }
    } catch (error) {
      return { result: false, error: error as Error }
    }
  }

  async getMaxDisplayOrder(): Promise<{ result: number, error: Error | null }> {
    try {
      const userId = await this.getUserId()
      if (userId.error) {
        return { result: 0, error: userId.error }
      }
      const rs = await this.db.select({
        maxDisplayOrder: max(portfolioArtworks.displayOrder)
      })
        .from(portfolioArtworks)
        .where(eq(portfolioArtworks.userId, userId.result))

      if (!rs[0].maxDisplayOrder) {
        return { result: 0, error: null }
      }
      return { result: rs[0].maxDisplayOrder, error: null }
    } catch (error) {
      return { result: 0, error: error as Error }
    }
  }

  async getUserId(): Promise<{ result: string, error: Error | null }> {
    const supabaseServerClient = await createClient()
    const { data: { session } } = await supabaseServerClient.auth.getSession()
    if (session?.user) {
      return { result: session.user.id, error: null }
    }
    return { result: '', error: new Error('User not logged in', { cause: session }) }
  }
}

export {
  type PortfolioUserCase,
  PortfolioUserCaseImpl
}