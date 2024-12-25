// File: components/analytics/PostHogPageView.tsx
'use client'

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { usePostHog } from 'posthog-js/react';

function PostHogPageView() : null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    console.debug('PostHogPageView component loaded');
    // Track pageviews
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture(
        '$pageview',
        {
          '$current_url': url,
        }
      )
    }
  }, [pathname, searchParams, posthog])
  
  return null
}

export default function SuspendedPostHogPageView() {
  return <Suspense fallback={null}>
    <PostHogPageView />
  </Suspense>
}
