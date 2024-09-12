// Components
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'
// I18n
import { useTranslation } from 'react-i18next'
// Types
import { ThumbnailSupabaseFile } from '@/app/types/SupabaseFile'

interface FileTableProps {
  files: ThumbnailSupabaseFile[];
  isReadonly: boolean;
  thumbnailFile: string | null;
  setThumbnailFile: (file: string | null) => void;
  removeFile: (file: ThumbnailSupabaseFile) => void;
}

export const FileTable: React.FC<FileTableProps> = ({ files, isReadonly, thumbnailFile, setThumbnailFile, removeFile }) => {
  const { t } = useTranslation(['media-upload']);

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
    if (thumbnailFile === file.name) {
      setThumbnailFile(null);
    }
  }

  const handleThumbnailChange = (fileName: string) => {
    setThumbnailFile(fileName);
    // Update the is_thumbnail property for all files
    files.forEach(file => {
      file.isThumbnail = file.name === fileName;
    });
  }

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">{t("pending_table.thumbnail")}</TableHead>
          <TableHead>{t("pending_table.file")}</TableHead>
          {!isReadonly && <TableHead className="text-center">{t("pending_table.remove")}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file, index) => (
          <TableRow key={index}>
            <TableCell className="text-center">
              <RadioGroup
                className="flex items-center justify-center"
                value={thumbnailFile || ''} 
                onValueChange={handleThumbnailChange}>
                <RadioGroupItem 
                  value={file.name} 
                  id={`thumbnail-${index}`} 
                  disabled={isReadonly}
                  checked={file.isThumbnail} 
                />
              </RadioGroup>
            </TableCell>
            <TableCell className="flex items-center">
              <div className="truncate">
                <span>{truncateFileName(file.name)}</span>
                <br />
                <span className="text-muted-foreground">{formatSize(file.size)}</span>
              </div>
            </TableCell>
            {!isReadonly && (
              <TableCell className="text-center">
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