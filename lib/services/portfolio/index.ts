import { db } from "@/lib/db"
import { PortfolioUserCaseImpl } from "./uc"

function getPortfolioUsecase() {
  return new PortfolioUserCaseImpl(db)
}

export {
  getPortfolioUsecase
}