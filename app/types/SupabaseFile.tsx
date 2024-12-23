export interface SupabaseFile {
  id: string;
  path: string;
  fullPath: string;
  name: string;
  size: number;
}

export interface ThumbnailSupabaseFile extends SupabaseFile {
  isThumbnail: boolean;
}