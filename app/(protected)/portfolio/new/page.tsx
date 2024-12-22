import { BackgroundDiv } from '@/components/wrappers/BackgroundDiv';
import { UserHeader } from '@/components/wrappers/UserHeader';
import { getServerAuth } from '@/hooks/useServerAuth';
import React, { Suspense } from 'react'
import { BackButton } from '../../profile/BackButton';
import CreateProfoiloForm from '@/components/portfolio/CreateProfoiloForm';
import { UploadMediaProvider } from '@/components/portfolio/UploadFile';
import { redirect } from 'next/navigation';

interface PortfolioCreatePageProps {
  params: Promise<{}>;
  searchParams: Promise<{
    lang: string;
  }>;
}

export default async function PortfolioCreatePage(props: PortfolioCreatePageProps) {
  const { isLoggedIn } = await getServerAuth();
  const searchParams = await props.searchParams;
  const params = await props.params;
  const lang = searchParams.lang || "en";
  if (!isLoggedIn) {
    redirect("/login");
  }
  return (
    <BackgroundDiv className='w-full min-h-screen'>
      <UserHeader
        lang={lang}
        isLoggedIn={isLoggedIn}
        className="bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-30"
      />
      <main className='min-h-screen w-screen pt-10 lg:pt-32 px-2 lg:px-8 flex flex-col'>
        <div className="container mx-auto mb-4">
          <BackButton />
        </div>
        <UploadMediaProvider>
          <CreateProfoiloForm lang={lang} />
        </UploadMediaProvider>
      </main>
    </BackgroundDiv>
  );
}
