'use client';

import { useQuery } from '@tanstack/react-query';
import { UserData } from "@/app/types/UserInfo";
import { ContactCard } from "./ContactCard";
import { EmptyContactCard } from "./EmptyContactCard";
import { useEffect } from 'react';
import { ErrorContactCard } from "./ErrorContactCard";
import { ContactListSkeleton } from "./ContactListSkeleton";

interface ContactListProps {
  userId: string;
  lang: string;
}
export function ContactList({ userId, lang }: ContactListProps) {
  const { data: contacts, isError, isLoading } = useQuery<UserData[]>({
    queryKey: ['contacts', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}/contacts`);
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      return response.json();
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  if (isLoading) {
    return <ContactListSkeleton />;
  }

  if (isError) {
    return <ErrorContactCard lang={lang} />;
  }

  if (!contacts || contacts.length === 0) {
    return <EmptyContactCard lang={lang} />;
  }
  return (
    <>
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contactId={contact.id}
          lang={lang}
          userData={contact}
          showButtons={false}
        />
      ))}
    </>
  );
}