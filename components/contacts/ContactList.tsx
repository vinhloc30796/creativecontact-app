'use client';

import { useEffect, useState } from 'react';
import { UserData } from "@/app/types/UserInfo";
import { ContactCard } from "./ContactCard";
import { EmptyContactCard } from "./EmptyContactCard";

export function ContactList({ userId, lang }: { userId: string, lang: string }) {
  const [contacts, setContacts] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContacts() {
      try {
        const response = await fetch(`/api/user/${userId}/contacts`);
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  
  if (contacts.length === 0) {
    return <EmptyContactCard lang={lang} />;
  }

  return contacts.map((contact) => (
    <ContactCard
      key={contact.id}
      lang={lang}
      userData={contact}
      showButtons={false}
    />
  ));
}