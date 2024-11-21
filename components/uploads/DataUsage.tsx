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

const DataUsage: React.FC = () => {
  const { pendingSize } = usePendingSizeStore();
  const maxSize = 25 * 1024 * 1024; // 25MB in bytes
  const isOverLimit = pendingSize > maxSize;
  const pendingPercentage = (pendingSize / maxSize) * 100;
  const remainingPercentage = 100 - pendingPercentage;

  return (
    <div className="flex flex-col">
      <div className="items-left mt-4 flex flex-col">
        <p className="my-2 flex-grow text-sm font-bold text-muted-foreground">
          DATA USAGE:
        </p>
        <p className="flex-grow text-sm text-muted-foreground">
          {formatSize(pendingSize)} of 25MB used
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
};

export default DataUsage;
