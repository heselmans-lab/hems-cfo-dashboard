import './globals.css';

export const metadata = {
  title: 'HEMS Energy & Financial Analytics',
  description: 'Smart Home Energy Management & Autonomous Financial Analytics',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
