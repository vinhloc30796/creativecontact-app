// Components
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'
// I18n
import { useTranslation } from 'react-i18next'
// Types
import { ThumbnailSupabaseFile } from '@/app/types/SupabaseFile'
import { useThumbnail } from "@/contexts/ThumbnailContext"

interface FileTableProps {
  files: ThumbnailSupabaseFile[];
  isReadonly: boolean;
  removeFile: (file: ThumbnailSupabaseFile) => void;
}

export const FileTable: React.FC<FileTableProps> = ({ files, isReadonly, removeFile }) => {
  const { t } = useTranslation(['media-upload']);
  const { thumbnailFileName, setThumbnailFileName } = useThumbnail();

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name
    const extIndex = name.lastIndexOf('.')
    const ext = extIndex !== -1 ? name.slice(extIndex) : ''
    const truncatedName = name.slice(0, maxLength - ext.length - 3) + '...'
    return truncatedName + ext
  }

  const handleRemoveFile = (file: ThumbnailSupabaseFile) => {
    removeFile(file);
    setThumbnailFileName(null);
  }

  const handleThumbnailChange = (fileName: string) => {
    setThumbnailFileName(fileName);
    // Update the is_thumbnail property for all files
    files.forEach(file => {
      const matched = file.name === fileName
      file.isThumbnail = matched;
      if (matched) {
        console.log("matched", matched, "for file", file.name);
      }
    });
  }

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center w-1/5">{t("pending_table.thumbnail")}</TableHead>
          <TableHead className=" w-1/5">{t("pending_table.file")}</TableHead>
          <TableHead className=" w-3/5">{t("pending_table.description")}</TableHead>
          {!isReadonly && <TableHead className="text-center w-1/5">{t("pending_table.remove")}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file, index) => (
          <TableRow key={index}>
            <TableCell className="text-center">
              <RadioGroup
                className="flex items-center justify-center"
                value={file.isThumbnail ? file.name : ''} 
                onValueChange={handleThumbnailChange}>
                <RadioGroupItem 
                  value={file.name} 
                  id={`thumbnail-${index}`} 
                  disabled={isReadonly}
                  checked={file.isThumbnail} 
                />
              </RadioGroup>
            </TableCell>
            <TableCell className="flex items-center w-full">
              <div className="truncate">
                <span>{truncateFileName(file.name)}</span>
                <br />
                <span className="text-muted-foreground">{formatSize(file.size)}</span>
              </div>
            </TableCell>
            <TableCell className="items-center w-full">
              <div>
              <input type="text" className=" bg-white w-full h-10 rounded-lg border-orange-200 border-2"></input>
              </div>
            </TableCell>
            {!isReadonly && (
              <TableCell className="text-center w-full">
                <button
                  type="button"
                  className="text-destructive"
                  onClick={() => handleRemoveFile(file)}
                  aria-label={`Remove ${file.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};