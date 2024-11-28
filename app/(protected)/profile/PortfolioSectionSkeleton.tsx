import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Mimic the structure of PortfolioTabs */}
      <div className="space-y-4">
        {/* Skeleton for tab buttons */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Skeleton for portfolio items grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Generate 6 skeleton cards */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              {/* Image skeleton */}
              <Skeleton className="aspect-square w-full rounded-lg" />
              {/* Title skeleton */}
              <Skeleton className="h-4 w-3/4" />
              {/* Description skeleton */}
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
