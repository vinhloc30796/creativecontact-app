'use client';

import { useQuery } from '@tanstack/react-query';
import { UserData } from "@/app/types/UserInfo";
import { ContactCard } from "./ContactCard";
import { EmptyContactCard } from "./EmptyContactCard";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useMemo } from 'react';
import { ContactListSkeleton } from './ContactListSkeleton';

interface ContactListProps {
  contactsPromise: Promise<UserData[]>;
  lang: string;
}

export function ContactList({ contactsPromise, lang }: ContactListProps) {
  const { data: contacts, isLoading } = useQuery<UserData[]>({
    queryKey: ['contacts'],
    queryFn: () => contactsPromise,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  const emptyState = useMemo(() => (
    <EmptyContactCard lang={lang} />
  ), [lang]);

  if (isLoading) return <ContactListSkeleton />;

  return !contacts || contacts.length === 0 ? emptyState : (
    contacts.map((contact) => (
      <ContactCard
        key={contact.id}
        lang={lang}
        userData={contact}
        showButtons={false}
      />
    ))
  );
}