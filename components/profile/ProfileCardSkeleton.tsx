import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileCardSkeleton() {
  return (
    <Card className="flex h-fit flex-col overflow-auto">
      <CardHeader className="flex flex-col items-center">
        <Skeleton className="mb-4 h-24 w-24 rounded-lg" />
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="mb-2 h-4 w-32" />
        <div className="mb-2 flex items-center gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="mb-4 h-4 w-40" />
        <Skeleton className="h-9 w-24" />
        <div className="pt-4 w-full">
          <Skeleton className="mb-2 h-6 w-24" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardHeader>
      <Separator className="my-4" />
      <CardContent className="mt-4">
        <div className="space-y-6">
          <section>
            <Skeleton className="mb-2 h-6 w-32" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-32" />
              ))}
            </div>
          </section>

          <section>
            <Skeleton className="mb-2 h-6 w-24" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </section>

          <Separator className="my-4" />

          <section>
            <Skeleton className="mb-2 h-6 w-28" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-36" />
            </div>
          </section>

          <Separator className="my-4" />

          <section>
            <Skeleton className="mb-2 h-6 w-36" />
            <div className="flex space-x-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-6 rounded-full" />
              ))}
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}
