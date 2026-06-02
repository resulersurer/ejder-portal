import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ejder Turizm · Portal',
  description: 'Ejder Turizm İç Portal Sistemi',
  icons: {
    icon: '/assets/img/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
