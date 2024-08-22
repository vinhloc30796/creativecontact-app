import { Html, Head, Body, Container, Tailwind } from "@react-email/components";
import React, { ReactNode } from 'react';
import { theme } from '../styles/theme';
import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
      </Head>
      <Tailwind config={theme}>
        <Body className="bg-background font-sans">
          <Container className="max-w-[600px] mx-auto p-8">
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};