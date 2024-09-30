// File: stores/uploadStore.ts

import { create } from 'zustand';

interface UploadState {
  uploadProgress: number;
  uploadedFileCount: number;
  totalFileCount: number;
  setUploadProgress: (progress: number, uploadedCount: number, totalCount: number) => void;
  resetUploadProgress: () => void;
}

export const useUploadStore = create<UploadState>()((set) => ({
  uploadProgress: 0,
  uploadedFileCount: 0,
  totalFileCount: 0,
  setUploadProgress: (progress: number, uploadedCount: number, totalCount: number) => set({ 
    uploadProgress: progress,
    uploadedFileCount: uploadedCount,
    totalFileCount: totalCount
  }),
  resetUploadProgress: () => set({ 
    uploadProgress: 0,
    uploadedFileCount: 0,
    totalFileCount: 0
  }),
}));