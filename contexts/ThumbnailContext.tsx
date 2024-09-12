import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThumbnailContextProps {
  thumbnailFileName: string | null;
  setThumbnailFileName: (fileName: string | null) => void;
}

const ThumbnailContext = createContext<ThumbnailContextProps | undefined>(undefined);

export const ThumbnailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [thumbnailFileName, setThumbnailFileName] = useState<string | null>(null);

  console.log("ThumbnailProvider rendering with thumbnailFileName:", thumbnailFileName);

  return (
    <ThumbnailContext.Provider value={{ thumbnailFileName, setThumbnailFileName }}>
      {children}
    </ThumbnailContext.Provider>
  );
};

export const useThumbnail = (): ThumbnailContextProps => {
  const context = useContext(ThumbnailContext);
  if (!context) {
    throw new Error('useThumbnail must be used within a ThumbnailProvider');
  }
  return context;
};