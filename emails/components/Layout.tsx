import { Html, Head, Body, Container, Tailwind, Font } from "@react-email/components";
import React, { ReactNode } from 'react';
import { theme } from '../styles/theme';
import { Footer } from './Footer';
import { Header } from './Header';
import {
  woff2PlusJakartaSansLink,
  googlePlusJakartaSansLink,
  googlePlusJakartaSansBoldLink,
  woff2BricolageGrotesqueLink,
  googleBricolageGrotesqueLink,
  googleBricolageGrotesqueBoldLink
} from "../styles/theme";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googlePlusJakartaSansLink} rel="stylesheet" />
        <link href={googleBricolageGrotesqueLink} rel="stylesheet" />
        <style id="import-google-plus-jakarta-sans">{`@import url(${googlePlusJakartaSansLink});`}</style>
        <style id="import-google-plus-jakarta-sans-bold">{`@import url(${googlePlusJakartaSansBoldLink});`}</style>
        <style id="import-google-bricolage-grotesque">{`@import url(${googleBricolageGrotesqueLink});`}</style>
        <style id="import-google-bricolage-grotesque-bold">{`@import url(${googleBricolageGrotesqueBoldLink});`}</style>
        <Font
          fontFamily="Plus Jakarta San"
          fallbackFontFamily={["Arial", "Helvetica", "sans-serif"]}
          webFont={{ url: woff2PlusJakartaSansLink, format: "woff2" }}
          fontStyle="normal"
        />
        <Font
          fontFamily="Bricolage Grotesque"
          fallbackFontFamily={["Arial", "Helvetica", "sans-serif"]}
          webFont={{ url: woff2BricolageGrotesqueLink, format: "woff2" }}
          fontStyle="normal"
        />
      </Head>
      <Tailwind config={theme}>
        <Body className="bg-background font-sans">
          <Container className="max-w-[600px] mx-auto p-8">
            <Header />
            <main>
              <Body className="bg-white my-auto mx-auto font-sans">
                <Container className="my-4 mx-auto p-5 max-w-[600px]">
                  {children}
                </Container>
              </Body>
            </main>
            <Footer />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};