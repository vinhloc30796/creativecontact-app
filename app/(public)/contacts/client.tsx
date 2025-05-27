'use client';

import React, { useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { UserContactView } from '@/app/api/users/helper';
import ContactSwimLane from '@/components/contacts/ContactSwimLane';

export default function ContactsInfinite() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<{ data: UserContactView[]; nextCursor?: number }, Error>({
    queryKey: ['contacts'],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: UserContactView[]; nextCursor?: number }> => {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Error fetching contacts');
      }
      const allContacts: UserContactView[] = await res.json();
      const limit = 5;
      const start = pageParam as number;
      const page = allContacts.slice(start, start + limit);
      const nextCursor = start + limit < allContacts.length ? start + limit : undefined;
      return { data: page, nextCursor };
    },
    initialPageParam: 0,
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
