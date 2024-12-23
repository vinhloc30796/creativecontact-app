import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LoadingUserHeaderProps {
  className?: string;
}

export const LoadingUserHeader: React.FC<LoadingUserHeaderProps> = ({ className }) => {
  return (
    <div className={cn("w-full flex", className)}>
      <div className="mx-auto flex w-full px-4 py-4 md:px-16 gap-4">
        <div className="flex-1">
          <div className="h-8 w-32 sm:h-12 md:h-16">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="hidden flex-1 justify-start lg:flex">
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="hidden flex-1 justify-end lg:flex">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};
