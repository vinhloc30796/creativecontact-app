import React, { createContext, useState, useContext, useEffect } from 'react';
import { ArtworkInfoData } from "@/app/form-schemas/artwork-info"


interface ArtworkContextType {
  currentArtwork: ArtworkInfoData | null;
  artworks: ArtworkInfoData[];
  setCurrentArtwork: (artwork: ArtworkInfoData | null) => void;
  addArtwork: (artwork: ArtworkInfoData) => void;
}

const ArtworkContext = createContext<ArtworkContextType>({
  currentArtwork: null,
  artworks: [],
  setCurrentArtwork: () => {},
  addArtwork: () => {},
});

export const ArtworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentArtwork, setCurrentArtwork] = useState<ArtworkInfoData | null>(null);
  const [artworks, setArtworks] = useState<ArtworkInfoData[]>([]);

  useEffect(() => {
    // Load artworks from localStorage on component mount
    const storedArtworks = localStorage.getItem('artworks');
    if (storedArtworks) {
      setArtworks(JSON.parse(storedArtworks));
    }
  }, []);

  const addArtwork = (artwork: ArtworkInfoData) => {
    setArtworks((prevArtworks) => {
      const newArtworks = [...prevArtworks, artwork];
      localStorage.setItem('artworks', JSON.stringify(newArtworks));
      return newArtworks;
    });
  };

  return (
    <ArtworkContext.Provider value={{ currentArtwork, artworks, setCurrentArtwork, addArtwork }}>
      {children}
    </ArtworkContext.Provider>
  );
};

export const useArtwork = () => useContext(ArtworkContext);