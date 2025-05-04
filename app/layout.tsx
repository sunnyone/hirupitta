import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Hirupitta - レストラン推薦チャット',
  description: '気分に合ったレストランを推薦するAIチャット',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
