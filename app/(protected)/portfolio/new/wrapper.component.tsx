'use client'
import React from 'react'
import { FileUploadProvider } from './files_uplooad_provider.component'
import PortfolioCreateCard from './portfolio_create_card.component'

export default function Wrapper() {
  return (
    <FileUploadProvider>
      <PortfolioCreateCard />
    </FileUploadProvider>
  )
}
