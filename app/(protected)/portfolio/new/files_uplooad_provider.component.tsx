import { createContext, FC, ReactNode, useContext, useState } from "react";

interface FileUploadContextType {
  fileUploads: File[],
  thumbnailFileName: string,
  setThumbnailFileName: (fileName: string) => void
  addFiles: (newFiles: File[]) => void,
  removeFile: (fileName: string) => void,
}
const FileUploadContext = createContext<FileUploadContextType>({
  fileUploads: [],
  addFiles: () => { },
  removeFile: () => { },
  thumbnailFileName: "",
  setThumbnailFileName: () => { },
})

export const FileUploadProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [fileUploads, setFileUploads] = useState<File[]>([]);
  const [thumbnailFileName, setThumbnailFileName] = useState<string>("");
  const addFiles = (newFiles: File[]) => {
    setFileUploads((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const removeFile = (fileName: string) => {
    setFileUploads((prevFiles) => prevFiles.filter(file => file.name !== fileName));
  }

  return (
    <FileUploadContext.Provider value={{ fileUploads, addFiles, removeFile, thumbnailFileName, setThumbnailFileName }}>
      {children}
    </FileUploadContext.Provider>
  )
}

export const useFileUpload = () => useContext(FileUploadContext)