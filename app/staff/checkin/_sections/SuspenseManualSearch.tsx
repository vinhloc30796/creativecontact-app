// File: app/staff/checkin/_sections/HybridManualSearch.tsx

import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Suspense, lazy } from 'react';

const ManualSearch = lazy(() => import('./ManualSearch'));

export default function SuspenseManualSearch() {
  return (
    <Suspense fallback={<ManualSearchPlaceholder />}>
      <ManualSearch />
    </Suspense>
  );
}

function ManualSearchPlaceholder() {
  return (
    <div className="aspect-square w-full">
      <Button
        variant="outline"
        className="w-full h-full flex flex-col items-center justify-center border rounded bg-white hover:bg-black hover:text-white transition-colors duration-300"
      >
        <Search className="h-8 w-8 mb-2" />
        <span className="text-xs uppercase font-bold">Manual Search</span>
      </Button>
    </div>
  );
}