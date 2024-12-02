import { createClient } from "@/utils/supabase/client"
import { deletePortfolio } from "./server.action";

export const deletePortfolioClient = async (portfolioId: string) => {
  const client = createClient()
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    return { data: { success: false }, error: new Error('Unauthorized') }
  }
  const userId = user.id;
  const rs = await deletePortfolio(portfolioId, userId)
  return rs
}