import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { LoadingUserHeader, UserHeader } from '@/components/wrappers/UserHeader';
import { useServerAuth } from '@/hooks/useServerAuth';
import React, { Suspense } from 'react'
import { BackButton } from '../../profile/BackButton';
import PortfolioCreateCard from './portfolio_create_card.component';
import Wrapper from './wrapper.component';

interface PortfolioCreatePageProps {
  params: {},
  searchParams: {
    lang: string
  }
}

export default async function PortfolioCreatePage(props: PortfolioCreatePageProps) {
  const { isLoggedIn } = await useServerAuth();
  const lang = props.searchParams.lang || "en";
  const project = {
    portfolioArtworks: {
      id: "new",
    },
    artworks: null,
  }
  return (
    <BackgroundDiv className='w-full min-h-screen'>
      <Suspense fallback={<LoadingUserHeader />}>
        <UserHeader
          lang={lang}
          isLoggedIn={isLoggedIn}
          className="bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-30"
        />
      </Suspense>
      <main className='min-h-screen w-screen pt-10 lg:pt-32 flex flex-col flex-grow px-2'>
        <div className="container mx-auto mb-4">
          <BackButton />
        </div>
        <Wrapper />
      </main>
    </BackgroundDiv>
  )
}
