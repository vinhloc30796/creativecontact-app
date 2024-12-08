'use client';

import { UserData } from "@/app/types/UserInfo";
import { PortfolioArtworkWithDetails } from "@/drizzle/schema/portfolio";
import { createContext, useContext } from "react";

interface ProfileDataContextType {
  userDataPromise: Promise<UserData | null>;
  portfolioPromise: Promise<PortfolioArtworkWithDetails[]>;
  contactsPromise: Promise<UserData[]>;
}

export const ProfileDataContext = createContext<ProfileDataContextType | null>(null);

export function ProfileDataProvider({ 
  children, 
  userDataPromise,
  portfolioPromise,
  contactsPromise,
}: { 
  children: React.ReactNode;
  userDataPromise: Promise<UserData | null>;
  portfolioPromise: Promise<PortfolioArtworkWithDetails[]>;
  contactsPromise: Promise<UserData[]>;
}) {
  return (
    <ProfileDataContext.Provider value={{
      userDataPromise,
      portfolioPromise,
      contactsPromise,
    }}>
      {children}
    </ProfileDataContext.Provider>
  );
}

export function useProfileData() {
  const context = useContext(ProfileDataContext);
  if (!context) {
    throw new Error('useProfileData must be used within a ProfileDataProvider');
  }
  return context;
} 