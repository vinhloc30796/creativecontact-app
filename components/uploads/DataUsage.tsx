// StorageLimitDisplay.tsx
import React from "react";
import usePendingSizeStore from "@/stores/usePendingSizeStore";

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface DataUsageProps {
  dataUsage: number;
  fileCount?: number;
  maxSizeMB?: number;
}

export default function DataUsage({ dataUsage, fileCount = 0, maxSizeMB = 25 }: DataUsageProps) {
  const { pendingSize } = usePendingSizeStore();
  const maxSize = maxSizeMB * 1024 * 1024; // in bytes
  const isOverLimit = pendingSize > maxSize;
  const pendingPercentage = Math.min(100, (pendingSize / maxSize) * 100);
  const remainingPercentage = Math.max(0, 100 - pendingPercentage);

  return (
    <div className="flex flex-col">
      <div className="mt-1 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{fileCount} files</p>
        <p className="text-sm text-muted-foreground">
          {formatSize(pendingSize)} of {maxSizeMB}MB used
        </p>
      </div>
      {isOverLimit && (
        <div className="mt-2 flex items-center text-destructive">
          <span className="text-xs">Storage limit exceeded!</span>
        </div>
      )}
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="float-left h-full bg-primary"
          style={{ width: `${pendingPercentage}%` }}
        />
        <div
          className="float-left h-full bg-muted"
          style={{ width: `${remainingPercentage}%` }}
        />
      </div>
    </div>
  );
}
