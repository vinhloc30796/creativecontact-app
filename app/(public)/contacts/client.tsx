'use client';

import React, { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { UserContactView } from '@/app/api/users/helper';
import ContactSwimLane from '@/components/contacts/ContactSwimLane';

export default function ContactsInfinite() {
  // Stable seed for this pageload
  const seedRef = useRef<string>(Math.random().toString());
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<{ data: UserContactView[]; nextCursor?: string }, Error>({
    queryKey: ['contacts', seedRef.current],
    queryFn: async ({ pageParam }): Promise<{ data: UserContactView[]; nextCursor?: string }> => {
      const limit = 5;
      const cursor = pageParam as string | undefined;
      const params = new URLSearchParams();
      params.set('limit', limit.toString());
      params.set('seed', seedRef.current);
      if (cursor) params.set('cursor', cursor);
      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Error fetching contacts');
      }
      const result = await res.json();
      return {
        data: result.data as UserContactView[],
        nextCursor: result.nextCursor as string | undefined,
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(loadMoreRef.current);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      {items.map((contact, index) => (
        <ContactSwimLane key={contact.contactId} {...contact} rowIndex={index} />
      ))}
      <div ref={loadMoreRef} className="h-1" />
      {(isFetching || isFetchingNextPage) && (
        <p className="text-center py-2 text-foreground/70">Loading more...</p>
      )}
    </>
  );
}
